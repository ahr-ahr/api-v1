const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Mengunduh metadata dan URL media dari Pinterest
 * @param {string} url - URL Pinterest yang valid
 * @param {string} [savePath] - Path untuk menyimpan file media (jika tidak diberikan, nama file akan diambil dari judul)
 * @returns {Object} Metadata media dan status pengunduhan
 */
const downloadFromPinterest = async (url, savePath = null) => {
    try {
        // Validasi URL Pinterest
        if (!url || !/^https:\/\/(www\.)?pinterest\.com\/(pin\/\d+|[^\/]+\/[^\/]+|[^\/]+\/?$)|https:\/\/i\.pinimg\.com\/[a-zA-Z0-9\/\-_]+\.(jpg|jpeg|png|gif|webp)/.test(url)) {
            return {
                success: false,
                data: null,
                message: 'Invalid Pinterest URL.',
            };
        }

        // Permintaan HTTP untuk mengambil halaman Pinterest
        const response = await axios.get(url);

        // Muat HTML untuk parsing
        const $ = cheerio.load(response.data);

        // Ekstrak metadata menggunakan selektor CSS
        const metadata = {
            title: $('meta[property="og:title"]').attr('content') || 'Unknown Title',
            description: $('meta[property="og:description"]').attr('content') || null,
            imageUrl: $('meta[property="og:image"]').attr('content') || null,
        };

        // Validasi jika URL media tidak ditemukan
        if (!metadata.imageUrl) {
            throw new Error('Unable to fetch Pinterest media.');
        }

        // Tentukan nama file berdasarkan judul Pinterest, bersihkan karakter yang tidak valid untuk nama file
        const fileName = `${metadata.title.replace(/[\/:*?"<>|]/g, '')}.jpg`;
        
        // Tentukan savePath jika tidak diberikan, berdasarkan judul
        if (!savePath) {
            savePath = path.join(__dirname, `../../public/media-downloader/pinterest/${fileName}`);
        }

        // Jika `savePath` diberikan, lakukan unduhan media
        console.info(`[INFO] Downloading Pinterest media to ${savePath}`);
        const mediaResponse = await axios({
            url: metadata.imageUrl,
            method: 'GET',
            responseType: 'stream',
        });

        // Simpan media ke file
        const writer = fs.createWriteStream(savePath);
        mediaResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.info(`[SUCCESS] Pinterest media downloaded to ${savePath}`);

        return {
            success: true,
            data: metadata,
            message: `Pinterest media fetched and saved to ${savePath}.`,
        };
    } catch (error) {
        console.error(`[Pinterest Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Failed to fetch Pinterest media.',
        };
    }
};

module.exports = { downloadFromPinterest };
