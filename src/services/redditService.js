const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Mengunduh metadata dan URL media dari Reddit
 * @param {string} url - URL Reddit yang valid
 * @param {string} [savePath] - Path untuk menyimpan file media (optional)
 * @returns {Object} Metadata media dan URL media
 */
const downloadFromReddit = async (url, savePath = null) => {
    try {
        // Validasi URL Reddit
        if (!url || !/^https:\/\/(www\.)?reddit\.com\/r\/.+\/comments\/.+/.test(url)) {
            console.warn(chalk.yellow(`[WARNING] Invalid Reddit URL: ${url}`));
            return {
                success: false,
                data: null,
                message: 'Invalid Reddit URL. Please provide a valid post URL.',
            };
        }

        console.info(chalk.cyan(`[INFO] Starting fetch for URL: ${url}`));

        // Ambil HTML dari URL menggunakan axios
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            },
        });
        console.info(chalk.green(`[INFO] Successfully fetched HTML content from Reddit.`));

        // Parsing HTML
        const $ = cheerio.load(response.data);
        console.info(chalk.cyan(`[INFO] Parsing HTML content for metadata...`));

        // Ekstraksi metadata
        const metadata = {
            title: $('h1').first().text().trim() || 'Unknown Title', // Judul post
            subreddit: $('shreddit-subreddit-header').attr('display-name') || 'Unknown Subreddit',
            mediaUrl: $('img[src*="preview.redd.it"], img[src*="i.redd.it"], img[src*="external-preview.redd.it"]').attr('src') || null, // URL gambar atau media
        };

        // Debugging untuk memeriksa elemen HTML
        console.info(chalk.blue(`[DEBUG] Parsed image URL: ${metadata.mediaUrl}`));

        // Validasi apakah media ditemukan
        if (!metadata.mediaUrl) {
            console.warn(chalk.yellow(`[WARNING] No media URL found in the provided Reddit post.`));
            return {
                success: false,
                data: null,
                message: 'Unable to fetch Reddit media. No media found in the provided URL.',
            };
        }

        console.info(chalk.green(`[INFO] Media URL found: ${metadata.mediaUrl}`));

        // Tentukan path penyimpanan file jika belum ada
        if (savePath === null) {
            // Tentukan nama file berdasarkan judul post Reddit (bersihkan karakter yang tidak valid)
            const fileName = `${metadata.title.replace(/[\/:*?"<>|]/g, '')}.jpg`;
            savePath = path.join(__dirname, `../../public/media-downloader/reddit/${fileName}`);
        }

        // Unduh media jika URL ditemukan
        const downloadResult = await downloadMedia(metadata.mediaUrl, savePath);
        console.info(chalk.green(`[SUCCESS] ${downloadResult}`));

        return {
            success: true,
            data: metadata,
            message: `Reddit media fetched and saved to ${savePath}.`,
        };
    } catch (error) {
        console.error(chalk.red(`[ERROR] Failed to fetch Reddit content: ${error.message}`));
        return {
            success: false,
            data: null,
            message: error.message || 'Failed to fetch Reddit media.',
        };
    }
};

/**
 * Mengunduh file media dari URL yang ditemukan
 * @param {string} fileUrl - URL media yang valid
 * @param {string} savePath - Path untuk menyimpan file
 */
const downloadMedia = async (fileUrl, savePath) => {
    try {
        // Mengunduh media menggunakan axios
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
        });

        // Simpan file ke path yang ditentukan
        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(`Media saved to ${savePath}`));
            writer.on('error', reject);
        });
    } catch (error) {
        throw new Error(`Failed to download media: ${error.message}`);
    }
};

module.exports = { downloadFromReddit, downloadMedia };
