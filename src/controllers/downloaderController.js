const { sendResponse } = require('../utils/responseHelper');
const { downloadFromTikTok } = require('../services/tiktokService');
const { downloadFromInstagram } = require('../services/instagramService');
const { downloadFromYouTube } = require('../services/youtubeService');
const { downloadFromSpotify } = require('../services/spotifyService');
const { downloadFromPinterest } = require('../services/pinterestService');
const { downloadFromFacebook } = require('../services/facebookService');
const { downloadFromReddit } = require('../services/redditService');

/**
 * Handles requests for downloading media from various platforms.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const downloadHandler = async (req, res) => {
    const { platform, url } = req.body;

    // Validasi input
    if (!platform || !url) {
        return sendResponse(res, 400, false, null, 'Platform and URL are required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'tiktok':
                data = await downloadFromTikTok(url);
                break;
            case 'instagram':
                data = await downloadFromInstagram(url);
                break;
            case 'youtube':
                data = await downloadFromYouTube(url);
                break;
            case 'spotify':
                data = await downloadFromSpotify(url);
                break;
            case 'pinterest':
                data = await downloadFromPinterest(url);
                break;
            case 'facebook':
                data = await downloadFromFacebook(url);
                break;
            case 'reddit':
                data = await downloadFromReddit(url);
                break;
            // case 'autogempa':
            //     data = await fetchAutogempa();
            //     break;
            // case 'gempaterkini':
            //     data = await fetchGempaterkini();
            //     break;
            // case 'gempadirasakan':
            //     data = await fetchGempadirasakan();
            //     break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platforms: tiktok, instagram, youtube, spotify, pinterest,');
        }

        // Pastikan respons dari service berhasil
        if (data.success) {
            sendResponse(res, 200, true, data.data, data.message || 'Download link fetched successfully.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to fetch media.');
        }
    } catch (error) {
        console.error(`Error processing download request for platform: ${platform}`, error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { downloadHandler };
