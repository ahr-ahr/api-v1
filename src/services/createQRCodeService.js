const QRCode = require('qrcode');
const path = require('path');

/**
 * Membuat kode QR dari data dan menyimpan sebagai file PNG
 * @param {string} data - Data yang ingin disematkan dalam kode QR
 * @param {string} filename - Nama file untuk menyimpan gambar QR
 */
const createQRCode = async (data, filename) => {
    try {
        // Tentukan lokasi penyimpanan di folder public/qr-codes
        const filePath = path.join('C:', 'Users', 'AHMAD HAIKAL RIZAL', 'OneDrive', '文档', 'api', 'v1', 'public', 'qr-codes', filename);

        // Membuat QR Code dengan ukuran 300x300 dan menyimpannya ke file
        await QRCode.toFile(filePath, data, { width: 500, height: 500 });
        console.log(`Kode QR berhasil dibuat dan disimpan di ${filePath}`);

        // URL yang dapat diakses dari browser
        // Misalnya, jika server Anda berjalan di http://localhost:3000
        const fileUrl = `http://localhost:3000/qr-codes/${filename}`; // Gantilah dengan domain atau IP Anda

        return {
            success: true,
            data: {
                filename: filePath,  // Path lokal
                qrCodeLink: fileUrl,  // Link URL yang dapat diakses
            },
            message: 'QR Code created successfully.'
        };
    } catch (error) {
        console.error('Gagal membuat kode QR:', error);
        return {
            success: false,
            data: null,
            message: 'Gagal membuat kode QR.'
        };
    }
};

module.exports = { createQRCode };
