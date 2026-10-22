const express = require('express');
const path = require('path');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;
const GIT_COMMIT = process.env.GIT_COMMIT || process.env.RENDER_GIT_COMMIT || 'development';

// Setup Prometheus metrics collection
client.collectDefaultMetrics({ prefix: 'placementhub_' });

const httpRequestsTotal = new client.Counter({
  name: 'placementhub_http_requests_total',
  help: 'Total number of HTTP requests processed by PlacementHub',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'placementhub_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

// Telemetry & metrics middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationSeconds = diff[0] + diff[1] / 1e9;
    const route = req.route ? req.route.path : req.path;
    httpRequestsTotal.inc({ method: req.method, route, status_code: res.statusCode });
    httpRequestDurationSeconds.observe({ method: req.method, route, status_code: res.statusCode }, durationSeconds);
  });
  next();
});

// JSON parser
app.use(express.json());

// Telemetry endpoint: Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'placementhub',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    commit: GIT_COMMIT
  });
});

// Telemetry endpoint: Prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Serve static frontend assets
app.use(express.static(path.join(__dirname)));

// Root landing page redirects or serves login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlacementHub server running on port ${PORT}`);
    console.log(`Health endpoint: http://localhost:${PORT}/health`);
    console.log(`Metrics endpoint: http://localhost:${PORT}/metrics`);
  });
}

module.exports = app;
