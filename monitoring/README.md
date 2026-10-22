# PlacementHub Monitoring & Observability

This directory contains Prometheus and Grafana configuration for PlacementHub telemetry and observability (Milestone 6).

## Architecture

- **Application Telemetry**: Exposes `/health` (system uptime, commit SHA) and `/metrics` (Prometheus-compatible HTTP counters, histograms, and Node.js process metrics).
- **Prometheus**: Periodically scrapes `http://web:3000/metrics` every 5 seconds. Configuration in `prometheus.yml`.
- **Grafana**: Pre-configured with automated Prometheus datasource and a comprehensive observability dashboard (`dashboard.json`).

## Dashboard Metrics

The dashboard visualizes:
1. **Service Uptime Status**: Real-time binary gauge of application readiness.
2. **Total HTTP Requests**: Aggregate counter of processed requests.
3. **HTTP Request Rate**: Requests per second broken down by route (`/`, `/health`, `/metrics`, etc.).
4. **Latency Percentiles**: 95th (p95) and 50th (p50) percentile HTTP response durations.
5. **Process Memory**: Resident set size (RSS) and Node.js V8 heap memory usage.

## Running Locally

To spin up the application along with Prometheus and Grafana:

```bash
docker compose up -d
```

- Application: [http://localhost:3000](http://localhost:3000)
- Prometheus UI: [http://localhost:9090](http://localhost:9090)
- Grafana Dashboard: [http://localhost:3001](http://localhost:3001) (Credentials: `admin` / `admin`)
