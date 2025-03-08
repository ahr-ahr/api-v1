const { sendResponse } = require('../utils/responseHelper');
const { fetchJadwalSalat } = require('../services/jadwalSalatService');

/**
 * Handles requests for prayer schedule services.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const jadwalSalatHandler = async (req, res) => {
    const { platform, city, country, date } = req.body;

    // Validasi input
    if (!platform || !city || !country || !date) {
        return sendResponse(res, 400, false, null, 'Platform, City, country, and date are required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'jadwalsalat':
                data = await fetchJadwalSalat(city, country, date);
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platforms: jadwalsalat.');
        }

        if (data.success) {
            sendResponse(res, 200, true, data.data, data.message || 'Prayer schedule fetched successfully.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to fetch prayer schedule.');
        }
    } catch (error) {
        console.error('Error fetching prayer schedule:', error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { jadwalSalatHandler };
