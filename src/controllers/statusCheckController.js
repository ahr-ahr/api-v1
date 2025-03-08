const { sendResponse } = require('../utils/responseHelper');
const { checkServerStatus } = require('../services/serverStatusService');

/**
 * API endpoint to check the status of a server.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const serverStatusHandler = async (req, res) => {
    const { platform, url, port } = req.body; // Extract URL and port from the request body

    // Validate input: Ensure URL is provided
    if (!platform || !url) {
        return sendResponse(res, 400, false, null, 'Platform and URL are required to check server status.');
    }

    try {
        let statusData;

        switch (platform.toLowerCase()) {
            case 'checkserver':
                statusData = await checkServerStatus(url, port);
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platform: checkserver');
        }

        // Send the response with the server status
        sendResponse(res, 200, statusData.success, statusData, statusData.message);
    } catch (error) {
        console.error('Error in server status check:', error.message);
        sendResponse(res, 500, false, null, 'Internal server error.');
    }
};

module.exports = { serverStatusHandler };
