const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      health: '/api/health',
      contact: '/api/contact',
      documentation: 'https://github.com/mukulbatra/portfolio-backend'
    }
  });
};

module.exports = notFound;