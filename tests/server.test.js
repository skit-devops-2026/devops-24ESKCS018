const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../server.js');

let server;
let port;

test.before((t, done) => {
  server = app.listen(0, '127.0.0.1', () => {
    port = server.address().port;
    done();
  });
});

test.after((t, done) => {
  server.close(done);
});

test('GET /health returns HTTP 200 with status ok', async () => {
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'placementhub');
  assert.ok(typeof data.uptime === 'number');
  assert.ok(data.timestamp);
});

test('GET /metrics returns Prometheus formatted metrics', async () => {
  const res = await fetch(`http://127.0.0.1:${port}/metrics`);
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.ok(body.includes('placementhub_http_requests_total'));
  assert.ok(body.includes('placementhub_'));
});

test('GET / serves login.html or landing page', async () => {
  const res = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.ok(body.includes('PlacementHub'));
});
