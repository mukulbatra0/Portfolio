const express = require('express');
const mongoose = require('mongoose');
const { verifyEmailConfig } = require('../config/email');
const router = express.Router();

// GET /api/health - Basic health check
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        api: 'healthy',
        database: 'unknown',
        email: 'unknown'
      }
    };

    // Check database connection
    try {
      if (mongoose.connection.readyState === 1) {
        healthCheck.services.database = 'healthy';
        await mongoose.connection.db.admin().ping();
      } else {
        healthCheck.services.database = 'disconnected';
      }
    } catch (error) {
      healthCheck.services.database = 'error';
      console.error('Database health check failed:', error.message);
    }

    // Check email configuration
    try {
      const emailHealthy = await verifyEmailConfig();
      healthCheck.services.email = emailHealthy ? 'healthy' : 'error';
    } catch (error) {
      healthCheck.services.email = 'error';
      console.error('Email health check failed:', error.message);
    }

    // Determine overall status
    const allServicesHealthy = Object.values(healthCheck.services).every(
      status => status === 'healthy'
    );
    
    if (!allServicesHealthy) {
      healthCheck.status = 'DEGRADED';
    }

    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthCheck);

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// GET /api/health/detailed - Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const detailedHealth = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        cpu: process.cpuUsage()
      },
      services: {
        api: {
          status: 'healthy',
          responseTime: Date.now()
        },
        database: {
          status: 'unknown',
          connection: mongoose.connection.readyState,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        },
        email: {
          status: 'unknown',
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_PORT === '465'
        }
      },
      configuration: {
        port: process.env.PORT || 5000,
        corsOrigins: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173'],
        rateLimiting: {
          windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
          maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100
        }
      }
    };

    // Detailed database check
    try {
      const dbStartTime = Date.now();
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        detailedHealth.services.database.status = 'healthy';
        detailedHealth.services.database.responseTime = Date.now() - dbStartTime;
        detailedHealth.services.database.collections = await mongoose.connection.db.listCollections().toArray();
      } else {
        detailedHealth.services.database.status = 'disconnected';
        detailedHealth.services.database.error = 'Database not connected';
      }
    } catch (error) {
      detailedHealth.services.database.status = 'error';
      detailedHealth.services.database.error = error.message;
    }

    // Detailed email check
    try {
      const emailStartTime = Date.now();
      const emailHealthy = await verifyEmailConfig();
      detailedHealth.services.email.status = emailHealthy ? 'healthy' : 'error';
      detailedHealth.services.email.responseTime = Date.now() - emailStartTime;
      detailedHealth.services.email.configured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    } catch (error) {
      detailedHealth.services.email.status = 'error';
      detailedHealth.services.email.error = error.message;
    }

    // Calculate API response time
    detailedHealth.services.api.responseTime = Date.now() - detailedHealth.services.api.responseTime;

    // Determine overall status
    const criticalServices = ['api', 'database'];
    const criticalServicesHealthy = criticalServices.every(
      service => detailedHealth.services[service].status === 'healthy'
    );
    
    if (!criticalServicesHealthy) {
      detailedHealth.status = 'DEGRADED';
    }

    const statusCode = detailedHealth.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(detailedHealth);

  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// GET /api/health/ping - Simple ping endpoint
router.get('/ping', (req, res) => {
  res.json({
    status: 'OK',
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;