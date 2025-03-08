const express = require('express');
const { serverStatusHandler } = require('../controllers/statusCheckController');
const { sendResponse } = require('../utils/responseHelper');

const router = express.Router();

/**
 * Middleware to log request
 */
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`);
    next();
});

/**
 * Route to check server status
 */
router.post('/', async (req, res, next) => {
    try {
        await serverStatusHandler(req, res);
    } catch (error) {
        console.error('Error in /check-server route:', error.message);
        next(error); // Oper error ke middleware penanganan error
    }
});

/**
 * Handle route not found
 */
router.use((req, res) => {
    sendResponse(res, 404, false, null, 'Route not found.');
});

/**
 * Global error handler
 */
router.use((err, req, res, next) => {
    console.error('Global error handler:', err.message);
    sendResponse(res, 500, false, null, 'Internal server error.');
});

module.exports = router;
