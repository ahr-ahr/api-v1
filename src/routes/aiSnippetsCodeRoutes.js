const express = require('express');
const { aiSnippetsCodeHandler } = require('../controllers/aiSnippetsCodeController');
const { sendResponse } = require('../utils/responseHelper');

const router = express.Router();

/**
 * Middleware untuk log request
 */
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`);
    next();
});

/**
 * Rute untuk menangani aiSnippetsCode
 */
router.post('/', async (req, res, next) => {
    try {
        await aiSnippetsCodeHandler(req, res);
    } catch (error) {
        console.error('Error in /ai-snippets-code route:', error.message);
        next(error); // Oper error ke middleware penanganan error
    }
});

/**
 * Penanganan rute yang tidak ditemukan
 */
router.use((req, res) => {
    sendResponse(res, 404, false, null, 'Route not found.');
});

/**
 * Middleware penanganan error global
 */
router.use((err, req, res, next) => {
    console.error('Global error handler:', err.message);
    sendResponse(res, 500, false, null, 'Internal server error.');
});

module.exports = router;
