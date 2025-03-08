const { sendResponse } = require('../utils/responseHelper');
const { fetchAutogempa } = require('../services/autoGempaService');
const { fetchGempaterkini } = require('../services/gempaTerkiniService');
const { fetchGempadirasakan } = require('../services/gempaDirasakanService');
const { fetchCuacaByWilayah } = require('../services/prakiraanCuacaService');
const { fetchKodeWilayah } = require('../services/kodeWilayahCuacaService');

/**
 * Handles requests for BMKG services, including gempa and cuaca.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const bmkgHandler = async (req, res) => {
    const { platform, kodeWilayah, query } = req.body;

    // Validasi input
    if (!platform) {
        return sendResponse(res, 400, false, null, 'Platform is required.');
    }

    try {
        let data;

        switch (platform.toLowerCase()) {
            case 'autogempa':
                data = await fetchAutogempa();
                break;
            case 'gempaterkini':
                data = await fetchGempaterkini();
                break;
            case 'gempadirasakan':
                data = await fetchGempadirasakan();
                break;
            case 'prakiraancuaca':
                if (!kodeWilayah) {
                    return sendResponse(res, 400, false, null, 'Kode wilayah is required for prakiraan cuaca.');
                }
                data = await fetchCuacaByWilayah(kodeWilayah);
                break;
            case 'kodewilayahcuaca':
                if (!query) {
                    return sendResponse(res, 400, false, null, 'Query is required for kode wilayah cuaca.');
                }
                data = await fetchKodeWilayah(query);
                break;
            default:
                return sendResponse(res, 400, false, null, 'Invalid platform. Supported platforms: autogempa, gempaterkini, gempadirasakan, prakiraancuaca, kodewilayahcuaca');
        }

        // Pastikan respons dari service berhasil
        if (data.success) {
            sendResponse(res, 200, true, data.data, data.message || 'BMKG data fetched successfully.');
        } else {
            sendResponse(res, 500, false, null, data.message || 'Failed to fetch BMKG data.');
        }
    } catch (error) {
        console.error(`Error processing get request for platform: ${platform}`, error.message);
        sendResponse(res, 500, false, null, error.message || 'Internal server error.');
    }
};

module.exports = { bmkgHandler };
