const { sendResponse } = require('../utils/responseHelper');
const { fetchWaktuDunia } = require('../services/waktuDuniaService');

/**
 * Handles requests for world time services.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const waktuDuniaHandler = async (req, res) => {
    const { platform, timezone } = req.body;

    // Validasi input
    if (!platform || !timezone) {
        return sendResponse(res, 400, false, null, 'Platform and Timezone are required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'waktudunia':
                data = await fetchWaktuDunia(timezone);
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platform: waktudunia');
        }

        // Pastikan respons berhasil
        if (data.success) {
            sendResponse(res, 200, true, data.data, data.message || 'World time fetched successfully.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to fetch world time.');
        }
    } catch (error) {
        console.error('Error fetching world time:', error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { waktuDuniaHandler };
