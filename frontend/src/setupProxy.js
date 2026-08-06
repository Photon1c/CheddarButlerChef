const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/generate-recipes', proxy({
    target: 'http://localhost:3005',
    changeOrigin: true,
    secure: false,
  }));
};