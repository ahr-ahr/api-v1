const { sendResponse } = require('../utils/responseHelper');
const { createSnippet } = require('../services/aiSnippetsCodeService');
const dotenv = require('dotenv'); // For managing environment variables

dotenv.config();

/**
 * Handles requests for snippet code generation.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const aiSnippetsCodeHandler = async (req, res) => {
    const { platform, query } = req.body;

    // Validate input: Ensure platform and query are provided
    if (!platform || !query) {
        return sendResponse(res, 400, false, null, 'Platform and query are required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'createsnippets':
                const apiKey = process.env.OPENAI_API_KEY;
                if (!apiKey) {
                    return sendResponse(res, 500, false, null, 'API key is missing.');
                }

                // Call the service to create a code snippet
                data = await createSnippet(query, apiKey);
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platform: createsnippets');
        }

        // Ensure the response from the service is successful
        if (data.success) {
            sendResponse(res, 200, true, { snippet: data.snippet }, data.message || 'Snippet code created successfully.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to create snippet code.');
        }
    } catch (error) {
        console.error('Error processing request for platform:', platform, error.message);
        sendResponse(res, 500, false, null, 'Internal server error.');
    }
};

module.exports = { aiSnippetsCodeHandler };
