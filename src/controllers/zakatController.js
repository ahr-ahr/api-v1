const { sendResponse } = require('../utils/responseHelper');
const { calculateZakat } = require('../services/zakatService');

/**
 * Handles requests for zakat calculation services.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const zakatHandler = async (req, res) => {
    const { platform, income, savings, nisab } = req.body;

    // Validasi input
    if (!platform || !income || !savings || !nisab) {
        return sendResponse(res, 400, false, null, 'Income, savings, and nisab are required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'kalkulatorzakat':
                data = await calculateZakat(Number(income), Number(savings), Number(nisab));
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platform: kalkulatorzakat');
        }

        if (data.success) {
            sendResponse(res, 200, true, data.data, data.message || 'Zakat calculation successful.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to calculate zakat.');
        }
    } catch (error) {
        console.error('Error calculating zakat:', error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { zakatHandler };
