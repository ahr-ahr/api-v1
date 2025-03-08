const { sendResponse } = require('../utils/responseHelper');
const { convertCurrencyRealtime } = require('../services/convertCurrencyRealtimeService');

/**
 * Handles requests for real-time currency conversion.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const currencyConversionHandler = async (req, res) => {
    const { platform, fromCurrency, toCurrency, amount } = req.body;

    // Validasi input
    if (!platform || !fromCurrency || !toCurrency || !amount) {
        return sendResponse(res, 400, false, null, 'platform, fromCurrency, toCurrency, and amount are required.');
    }

    let data;
    try {
        switch (platform.toLowerCase()) {
            case 'currencyconvertrealtime':
                // Panggil fungsi konversi mata uang dan pastikan parameter yang diperlukan disertakan
                data = await convertCurrencyRealtime(fromCurrency, toCurrency, amount);
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platforms: currencyconvertrealtime');
        }

        if (data.success) {
            sendResponse(res, 200, true, { result: data.result }, 'Currency conversion successful.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to convert currency.');
        }
    } catch (error) {
        console.error('Error processing currency conversion request:', error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { currencyConversionHandler };
