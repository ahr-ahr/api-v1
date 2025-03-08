const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Mengunduh metadata dan URL media dari Facebook
 * @param {string} url - URL Facebook yang valid
 * @returns {Object} Metadata media dan URL media
 */
const downloadFromFacebook = async (url) => {
    try {
        // Validasi URL Facebook
        if (!url || !/^https:\/\/www\.facebook\.com/.test(url)) {
            return {
                success: false,
                data: null,
                message: 'Invalid Facebook URL.',
            };
        }

        // Permintaan HTTP untuk mengambil halaman Facebook
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
            throw new Error('Unable to fetch Facebook media.');
        }

        return {
            success: true,
            data: metadata,
            message: 'Facebook media fetched successfully.',
        };
    } catch (error) {
        console.error(`[Facebook Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Failed to fetch Facebook media.',
        };
    }
};

module.exports = { downloadFromFacebook };
