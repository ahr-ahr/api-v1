const { sendResponse } = require('../utils/responseHelper');
const { fetchSpeedtest } = require('../services/speedTestService');

/**
 * Handles requests for SPEEDTEST services, including download, upload, and latensi.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const speedTestHandler = async (req, res) => {
    const { platform } = req.body;

    // Validasi input
    if (!platform) {
        return sendResponse(res, 400, false, null, 'Platform is required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'speedtest':
                data = await fetchSpeedtest();
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platforms: speedtest');
        }

        // Pastikan respons dari service berhasil
        if (data.success) {
            sendResponse(res, 200, true, data.data, data.message || 'SPEEDTEST data fetched successfully.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to fetch SPEEDTEST data.');
        }
    } catch (error) {
        console.error(`Error processing get request for platform: ${platform}`, error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { speedTestHandler };
