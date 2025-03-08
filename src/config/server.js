const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); // Untuk logging HTTP requests
const rateLimit = require('express-rate-limit'); // Untuk rate limiting
const helmet = require('helmet'); // Untuk meningkatkan keamanan

/**
 * Fungsi untuk mengonfigurasi dan memulai server Express
 * @returns {Object} - instance dari Express app
 */
const configureServer = () => {
    const app = express();

    // Mengaktifkan CORS untuk akses lintas domain
    app.use(cors());

    // Middleware untuk logging permintaan HTTP menggunakan morgan
    app.use(morgan('dev'));

    // Middleware untuk parsing JSON dan URL-encoded
    app.use(bodyParser.json({ limit: '100mb' })); // Batas maksimal untuk JSON
    app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' })); // Batas untuk URL-encoded

    // Menambahkan Helmet untuk meningkatkan keamanan
    app.use(helmet());

    // Rate Limiting: Batasi jumlah request per IP
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 menit
        max: 100, // Maksimal 100 request per IP dalam 15 menit
        message: 'Too many requests, please try again later.',
    });
    app.use(limiter);

    // Middleware untuk menangani error secara global
    app.use((err, req, res, next) => {
        console.error('Global error handler:', err.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    });

    return app;
};

module.exports = configureServer;
