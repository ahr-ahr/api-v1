const axios = require('axios');

/**
 * Fetches TikTok video details using the TikWM API.
 * @param {string} url - The TikTok video URL.
 * @returns {Object} - An object containing video, music, thumbnail URLs, and author information.
 * @throws {Error} - Throws an error if the fetch fails or the response is invalid.
 */
const downloadFromTikTok = async (url) => {
    try {
        const response = await axios.get('https://tikwm.com/api/', {
            params: { url },
        });

        // Validasi respons dari API
        if (response.data && response.data.data) {
            const { play, music, cover, author } = response.data.data;

            return {
                success: true,
                data: {
                    videoUrl: play, // Video tanpa watermark
                    musicUrl: music, // URL audio
                    thumbnail: cover, // Thumbnail video
                    author: author.nickname || 'Unknown', // Nama pembuat video
                },
                message: 'TikTok video fetched successfully.',
            };
        } else {
            throw new Error('Invalid response structure from TikWM API.');
        }
    } catch (error) {
        console.error('Error fetching TikTok video:', error.message);
        return {
            success: false,
            data: null,
            message: error.message || 'Failed to fetch TikTok video.',
        };
    }
};

module.exports = { downloadFromTikTok };
