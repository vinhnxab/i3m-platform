const prometheus = require('prom-client');

// Create a Registry to register the metrics
const register = new prometheus.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'notification-service'
});

// Enable the collection of default metrics
prometheus.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const notificationSent = new prometheus.Counter({
  name: 'notifications_sent_total',
  help: 'Total number of notifications sent',
  labelNames: ['type', 'status']
});

const notificationDeliveryTime = new prometheus.Histogram({
  name: 'notification_delivery_duration_seconds',
  help: 'Time taken to deliver notifications',
  labelNames: ['type'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60]
});

// Register the metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(notificationSent);
register.registerMetric(notificationDeliveryTime);

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

// Setup metrics endpoint
const setupMetrics = (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
};

module.exports = {
  setupMetrics,
  metricsMiddleware,
  httpRequestDuration,
  httpRequestTotal,
  notificationSent,
  notificationDeliveryTime,
  register
};
