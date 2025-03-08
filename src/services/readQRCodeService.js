const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { MultiFormatReader, BarcodeFormat, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } = require('@zxing/library');

/**
 * Membaca QR Code dari file gambar lokal atau URL
 * @param {string} input - Path file gambar lokal atau URL gambar QR Code
 * @returns {Promise<string>} - Teks yang disematkan dalam kode QR
 */
const readQRCode = async (input) => {
    try {
        let imageBuffer;

        if (input.startsWith('http://') || input.startsWith('https://')) {
            const response = await axios.get(input, { responseType: 'arraybuffer' });
            imageBuffer = Buffer.from(response.data);
        } else {
            const filePath = path.resolve(input);
            imageBuffer = fs.readFileSync(filePath);
        }

        const { data, info } = await sharp(imageBuffer)
            .resize({ width: 500 })
            .grayscale()
            .normalize()
            .threshold(128)
            .raw()
            .toBuffer({ resolveWithObject: true });

        const luminanceSource = new RGBLuminanceSource(data, info.width, info.height);

        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

        const codeReader = new MultiFormatReader();
        const result = codeReader.decode(binaryBitmap);

        return result.getText();

    } catch (error) {
        console.error('Gagal membaca QR Code:', error.message);
        throw new Error('Gagal membaca gambar atau QR Code: ' + error.message);
    }
};

module.exports = { readQRCode };
