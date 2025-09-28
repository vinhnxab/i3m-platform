const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label for all metrics
register.setDefaultLabels({
  app: 'preview-service'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Define custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 1.5, 2, 2.5, 3, 5, 10]
});

register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to measure request duration
const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
  });
  next();
};

// Endpoint to expose metrics
const setupMetrics = async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
};

module.exports = { setupMetrics, metricsMiddleware };
