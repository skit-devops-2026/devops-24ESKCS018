# Production Dockerfile for PlacementHub
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code and assets
COPY server.js utils.js index.html login.html register.html ./
COPY css/ ./css/
COPY js/ ./js/

# Expose web application port
EXPOSE 3000

# Define container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "server.js"]
