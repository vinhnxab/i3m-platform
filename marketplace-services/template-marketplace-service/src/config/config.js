module.exports = {
  port: process.env.PORT || 3028,
  env: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://i3m_user:i3m_password@mongodb:27017/i3m_template_marketplace_db?authSource=admin'
  }
};
