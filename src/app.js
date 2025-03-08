const express = require('express'); // Add this line
const configureServer = require('./config/server');
const downloaderRoutes = require('./routes/downloaderRoutes');
const bmkgRoutes = require('./routes/bmkgRoutes');
const speedTestRoutes = require('./routes/speedTestRoutes');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const aiSnippetsCodeRoutes = require('./routes/aiSnippetsCodeRoutes');
const currencyConversionRoutes = require('./routes/currencyConversionRoutes');
const zakatRoutes = require('./routes/zakatRoutes');
const jadwalSalatRoutes = require('./routes/jadwalSalatRoutes');
const waktuDuniaRoutes = require('./routes/waktuDuniaRoutes');
const statusCheckRoute = require('./routes/statusCheckRoute');
const whatsappRoutes = require('./routes/whatsappRoutes');
const chalk = require('chalk'); // Untuk meningkatkan warna dan gaya output konsol
const figlet = require('figlet'); // Untuk header ASCII art di console
const dotenv = require('dotenv'); // Untuk mengelola environment variables
const packageInfo = require('../package.json'); // Memuat informasi dari package.json
const nodemon = require('nodemon'); // Untuk mendeteksi event reload Nodemon
const path = require('path'); // Add path module

// Memuat environment variables dari .env file
dotenv.config();

// Membuat instance aplikasi dengan konfigurasi server
const app = configureServer();

// Routes
app.use('/api/download', downloaderRoutes);
app.use('/api/bmkg', bmkgRoutes);
app.use('/api/speedtest', speedTestRoutes);
app.use('/qr-codes', express.static(path.join(__dirname, '../public/qr-codes')));
app.use('/api/qrcode', qrCodeRoutes);
app.use('/api/ai-snippets-code', aiSnippetsCodeRoutes);
app.use('/api/convert-currency-realtime', currencyConversionRoutes);
app.use('/api/jadwal-salat', jadwalSalatRoutes);
app.use('/api/zakat', zakatRoutes);
app.use('/api/waktu-dunia', waktuDuniaRoutes);
app.use('/api/check-server', statusCheckRoute);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/whatsapp/qr-codes', express.static(path.join(__dirname, '../public/whatsapp/qr-codes')));

// Menangani error yang tidak terduga secara global
app.use((err, req, res, next) => {
    console.error(chalk.red(`[ERROR] ${err.message}`));
    res.status(500).json({
        success: false,
        message: 'Internal server error.',
    });
});

// Start server
const PORT = process.env.PORT || 3000;

// Fungsi untuk menampilkan informasi aplikasi
const displayAppInfo = () => {
    figlet('AHR REST API', (err, data) => {
        if (err) {
            console.log(chalk.red('Error generating figlet text.'));
            return;
        }
        console.log(chalk.green(data)); // Menampilkan teks ASCII

        // Informasi Server
        console.log(
            chalk.green(`Server is running on: ${chalk.yellow(`http://localhost:${PORT}`)}`)
        );
        console.log(chalk.blue(`Environment: ${process.env.NODE_ENV || 'development'}`));
        console.log(chalk.gray(`Server started at: ${new Date().toLocaleString()}`));

        // Menampilkan Informasi dari package.json
        console.log(chalk.cyan.bold('\n--- Application Information ---'));
        console.log(chalk.cyan(`Author: ${chalk.white(packageInfo.author)}`));
        console.log(chalk.cyan(`Version: ${chalk.white(packageInfo.version)}`));
        console.log(chalk.cyan(`Description: ${chalk.white(packageInfo.description)}`));
        console.log(chalk.cyan(`License: ${chalk.white(packageInfo.license)}`));
        console.log(
            chalk.cyan(
                `Repository: ${chalk.white(packageInfo.repository ? packageInfo.repository.url : 'Not provided')}`
            )
        );
        console.log(
            chalk.cyan(`Bugs: ${chalk.white(packageInfo.bugs ? packageInfo.bugs.url : 'Not provided')}`)
        );
        console.log(
            chalk.cyan(`Homepage: ${chalk.white(packageInfo.homepage || 'Not provided')}`)
        );
        console.log(chalk.cyan.bold('--------------------------------\n'));
    });
};

// Jalankan server
app.listen(PORT, () => {
    displayAppInfo();
});


// Deteksi event Nodemon
// nodemon({ script: 'src/app.js' });

// nodemon.on('restart', () => {
//     console.log(chalk.magenta('[INFO] Changes detected. Reloading server...'));
//     displayAppInfo(); // Menampilkan ulang informasi aplikasi
// });

//  nodemon.on('quit', () => {
//     console.log(chalk.red('[INFO] Server is shutting down...'));
//     process.exit();
// });

// nodemon.on('start', () => {
//     displayAppInfo();
//     console.log(chalk.green('[INFO] Server started successfully.'));
// });
