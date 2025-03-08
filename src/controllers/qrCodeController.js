const { sendResponse } = require('../utils/responseHelper');
const { createQRCode } = require('../services/createQRCodeService');
const { readQRCode } = require('../services/readQRCodeService');

/**
 * Handles requests for QR code services, including creating and reading QR codes.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const qrCodeHandler = async (req, res) => {
    const { platform, textOrUrl } = req.body;

    // Validasi input
    if (!platform || !textOrUrl) {
        return sendResponse(res, 400, false, null, 'Platform and text/url are required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'createqrcode':
                // Menyertakan textOrUrl untuk membuat QR Code
                data = await createQRCode(textOrUrl, 'qrcode.png');
                break;
            case 'readqrcode':
                // Menyertakan nama file untuk membaca QR Code
                data = await readQRCode(textOrUrl);
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platforms: createqrcode, readqrcode');
        }

        // Pastikan respons dari service berhasil
        if (data.success) {
            sendResponse(res, 200, true, data.data, data.message || 'QR Code data processed successfully.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to process QR Code data.');
        }
    } catch (error) {
        console.error(`Error processing request for platform: ${platform}`, error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { qrCodeHandler };
