# PlacementHub — Campus Placement & Internship Management System

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS018 | Aditi Yadav | Aditiiydv |

## About

PlacementHub is a Campus Placement and Internship Management System designed to streamline the recruitment process for educational institutes. The application connects students, recruiters, and the institute placement cell through role-based portals, eligibility-based opportunities, application tracking, and recruiter verification workflows.

## Tech stack

- Frontend: HTML5, CSS3, JavaScript, jQuery
- Backend: Node.js, Express
- Telemetry & Monitoring: Prometheus, Grafana
- Containerization & Orchestration: Docker, Docker Compose, Kubernetes
- CI/CD: GitHub Actions, Jenkins

## Running locally

1. Install dependencies and start the Node.js application server:

```bash
npm install
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) in your web browser.

3. To run automated test suites and syntax verification:

```bash
npm test
npm run build
```

## Live URL

[Open PlacementHub Live Deployment](https://skit-devops-2026.github.io/devops-24ESKCS018/)

The deployment record and UI verification are committed at [`docs/deployment-screenshot.png`](docs/deployment-screenshot.png).

## Health endpoint

`GET /health` returns JSON telemetry status including service availability, process uptime, timestamp, and commit SHA:

```json
{
  "status": "ok",
  "service": "placementhub",
  "uptime": 120,
  "timestamp": "2026-10-22T08:00:00.000Z",
  "commit": "latest"
}
```

## Metrics endpoint

`GET /metrics` exposes real Prometheus metrics using `prom-client`, including:
- `placementhub_http_requests_total`: Counter tracking HTTP requests labeled by method, route, and status code.
- `placementhub_http_request_duration_seconds`: Histogram tracking request latency percentiles (p50, p95).
- `placementhub_process_resident_memory_bytes` & `placementhub_nodejs_heap_size_used_bytes`: Runtime memory telemetry.

---

# MT2 — Containerization, Deployment, Monitoring & Kubernetes

## 1. Docker Setup & Build (M5)

The application is packaged as an optimized, production-ready container based on `node:22-alpine` with an integrated health check.

- **Build image**:
  ```bash
  docker build -t ghcr.io/skit-devops-2026/devops-24eskcs018:latest .
  ```
- **Run container**:
  ```bash
  docker run -d -p 3000:3000 --name placementhub ghcr.io/skit-devops-2026/devops-24eskcs018:latest
  ```

## 2. Docker Compose (M5)

The `docker-compose.yml` file provisions the full observability stack:
- **web**: PlacementHub application container (`PORT=3000`) with built-in healthchecks.
- **prometheus**: Scrapes `/metrics` from the web container every 5 seconds (`PORT=9090`).
- **grafana**: Visualizes metrics with provisioned dashboards and datasources (`PORT=3001`).

```bash
# Start all services
docker compose up -d

# Verify services
docker compose ps
```

## 3. Container Registry Image (M5)

The Docker image is built and published automatically to GitHub Container Registry (GHCR):

- **Image URI**: `ghcr.io/skit-devops-2026/devops-24eskcs018:latest`
- **Pull command**:
  ```bash
  docker pull ghcr.io/skit-devops-2026/devops-24eskcs018:latest
  ```

## 4. Deployment and Monitoring (M6)

- **Live URL**: [https://skit-devops-2026.github.io/devops-24ESKCS018/](https://skit-devops-2026.github.io/devops-24ESKCS018/)
- **Prometheus Configuration**: Located at [`monitoring/prometheus.yml`](monitoring/prometheus.yml).
- **Grafana Dashboard**: Committed under [`monitoring/dashboard.json`](monitoring/dashboard.json) and [`monitoring/grafana/dashboards/placementhub-dashboard.json`](monitoring/grafana/dashboards/placementhub-dashboard.json).
- **Deployment Screenshot**: Committed under [`docs/deployment-screenshot.png`](docs/deployment-screenshot.png).

## 5. Kubernetes Orchestration (M7)

Kubernetes manifests are located in the `k8s/` directory and reference the official registry image `ghcr.io/skit-devops-2026/devops-24eskcs018:latest`:

- **Deployment Manifest** ([`k8s/deployment.yaml`](k8s/deployment.yaml)): Configures 2 replicas, readiness & liveness probes on `/health`, and resource limits.
- **Service Manifest** ([`k8s/service.yaml`](k8s/service.yaml)): Configures a `NodePort` service mapping port 80 to container port 3000 (NodePort 30080).

**Apply manifests to cluster**:
```bash
kubectl apply -f k8s/
kubectl get pods -l app=placementhub
kubectl get services placementhub-service
```

---

## M2 Branching and Pull Request Practice

This repository follows standard feature-branch workflows with dedicated PRs and clear commit histories.
