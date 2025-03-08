const express = require('express');
const { whatsappHandler } = require('../controllers/whatsappController');
const { initializeSession } = require('../services/whatsappService');
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
 * Rute untuk inisialisasi sesi WhatsApp.
 */
router.get('/initialize-session/:sessionName', async (req, res) => {
    const { sessionName } = req.params;

    if (!sessionName) {
        return sendResponse(res, 400, false, null, 'Session name is required.');
    }

    try {
        const response = await initializeSession(sessionName);
        sendResponse(res, 200, true, response, 'Session initialization in progress.');
    } catch (error) {
        console.error('Error initializing session:', error.message);
        sendResponse(res, 500, false, null, error.message);
    }
});

/**
 * Rute untuk menangani permintaan POST (default handler).
 */
router.post('/', async (req, res, next) => {
    try {
        await whatsappHandler(req, res);
    } catch (error) {
        console.error('Error in /whatsapp:', error.message);
        next(error); // Oper error ke middleware penanganan error
    }
});

/**
 * Penanganan rute yang tidak ditemukan.
 */
router.use((req, res) => {
    sendResponse(res, 404, false, null, 'Route not found.');
});

/**
 * Middleware penanganan error global.
 */
router.use((err, req, res, next) => {
    console.error('Global error handler:', err.message);
    sendResponse(res, 500, false, null, 'Internal server error.');
});

module.exports = router;
