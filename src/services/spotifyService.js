const { getData, getPreview } = require('spotify-url-info'); // Menggunakan fungsi tambahan untuk mengambil data detail dan pratinjau

/**
 * Mengunduh metadata dan URL media dari Spotify
 * @param {string} url - URL Spotify yang valid
 * @returns {Object} Informasi metadata lengkap dan URL media yang relevan
 */
const downloadFromSpotify = async (url) => {
    try {
        if (!url || !url.startsWith('https://open.spotify.com')) {
            throw new Error('Invalid Spotify URL.');
        }

        // Ambil pratinjau sederhana dari Spotify URL
        const preview = await getPreview(url);
        if (!preview) {
            throw new Error('Unable to fetch Spotify preview data.');
        }

        // Ambil data detail untuk metadata lengkap
        const data = await getData(url);

        // Format response untuk hasil metadata dan URL audio
        return {
            success: true,
            data: {
                title: preview.title || data.name || 'Unknown Title',
                type: data.type || 'Unknown Type', // Can be 'track', 'album', 'playlist', etc.
                artist: preview.artist || data.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist',
                thumbnail: preview.image || data.images?.[0]?.url || null,
                description: preview.description || null,
                externalUrls: data.external_urls && Object.keys(data.external_urls).length > 0 ? data.external_urls : null, // Return null if empty
                mediaUrl: preview.audio || null, // Return null if audio URL is not available
            },
            message: 'Spotify media fetched successfully.',
        };
    } catch (error) {
        console.error('Error fetching Spotify media:', error.message);
        return {
            success: false,
            data: null,
            message: error.message || 'Failed to fetch Spotify media.',
        };
    }
};

module.exports = { downloadFromSpotify };
