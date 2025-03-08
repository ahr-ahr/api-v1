const sendResponse = (res, statusCode, success = true, data = null, message = '') => {
    // Ensure success is always a boolean
    const response = {
        success: typeof success === 'boolean' ? success : true, // Default to true if not boolean
        data: data || null, // Default to null if no data is passed
        message: message || '', // Default to empty string if no message is passed
    };

    // Log the response for debugging
    console.log(`Response sent: ${statusCode} | Success: ${response.success} | Message: ${response.message}`);

    // Send the JSON response
    res.status(statusCode).json(response);
};

module.exports = { sendResponse };
