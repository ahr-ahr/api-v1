const ytdl = require('ytdl-core');

/**
 * Mengunduh metadata video dari YouTube
 * @param {string} url - URL video YouTube
 * @returns {Object} Metadata video YouTube
 */
const downloadFromYouTube = async (url) => {
    try {
        // Validasi URL
        if (!ytdl.validateURL(url)) {
            throw new Error('Invalid YouTube URL.');
        }

        // Ambil informasi video
        const info = await ytdl.getInfo(url);

        // Cek jika video tersedia
        if (!info || !info.videoDetails) {
            throw new Error('Video information is unavailable.');
        }

        // Format hasil
        return {
            success: true,
            data: {
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                description: info.videoDetails.description,
                duration: info.videoDetails.lengthSeconds, // Durasi video dalam detik
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
                videoFormats: info.formats
                    .filter((format) => format.hasVideo && !format.hasAudio)
                    .map((format) => ({
                        quality: format.qualityLabel,
                        resolution: format.height ? `${format.height}p` : (format.qualityLabel || 'Unknown'), // Menambahkan resolusi
                        url: format.url,
                    })),
                audioFormats: info.formats
                    .filter((format) => format.hasAudio && !format.hasVideo)
                    .map((format) => ({
                        bitrate: format.audioBitrate,
                        codec: format.audioCodec || 'mp3', // Default codec jika tidak ada
                        url: format.url,
                    })),
            },
            message: 'YouTube video metadata fetched successfully.',
        };
    } catch (error) {
        console.error('Error fetching YouTube video:', error.message);
        return {
            success: false,
            data: null,
            message: error.message || 'Failed to fetch YouTube video.',
        };
    }
};

module.exports = { downloadFromYouTube };
