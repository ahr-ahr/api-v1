const instagramUrlDirect = require('instagram-url-direct');

/**
 * Mengunduh media dari URL Instagram
 * @param {string} url - URL Instagram yang valid
 * @returns {Object} Metadata media dan URL media
 */
const downloadFromInstagram = async (url) => {
    try {
        // Check for a valid Instagram URL format
        if (!url || !url.startsWith('https://www.instagram.com')) {
            console.log("Invalid URL detected:", url);  // Debugging line
            return {
                success: false,
                data: null,
                message: 'Invalid Instagram URL.',
            };
        }           

        // Fetch media metadata from Instagram
        const media = await instagramUrlDirect(url);

        if (media?.url) {
            return {
                success: true,
                data: {
                    type: media.type || 'Unknown',
                    mediaUrl: media.url,
                    caption: media.caption || null,
                },
                message: 'Instagram media fetched successfully.',
            };
        } else {
            throw new Error('Unable to fetch Instagram media.');
        }
    } catch (error) {
        console.error('Error fetching Instagram media:', error.message);
        return {
            success: false,
            data: null,
            message: error.message || 'Failed to fetch Instagram media.',
        };
    }
};

module.exports = { downloadFromInstagram };
