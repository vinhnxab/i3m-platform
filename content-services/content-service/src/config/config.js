const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  // Server settings
  port: process.env.PORT || 3022,
  env: process.env.NODE_ENV || 'development',

  // Database settings
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://i3m_user:i3m_password@mongodb:27017/i3m_content_db?authSource=admin',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }
  },

  // Redis settings
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || 'i3m_password',
    db: process.env.REDIS_DB || 12
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretcontentsecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8000'
    ],
    credentials: true
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },

  // File upload settings
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      videos: ['video/mp4', 'video/mpeg', 'video/quicktime'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
    },
    destination: process.env.UPLOAD_PATH || './uploads'
  },

  // Content settings
  content: {
    maxTitleLength: 200,
    maxSummaryLength: 500,
    maxContentLength: 100000,
    maxTagsCount: 20,
    maxCategoriesCount: 10,
    defaultPageSize: 20,
    maxPageSize: 100
  },

  // Service URLs
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3008',
    user: process.env.USER_SERVICE_URL || 'http://user-service:3009',
    media: process.env.MEDIA_SERVICE_URL || 'http://media-service:3021'
  }
};

module.exports = config;
