const axios = require('axios');

/**
 * Mengambil data gempa terbaru dari BMKG
 * @returns {Object} Data gempa terbaru
 */
const fetchAutogempa = async () => {
    try {
        const url = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
        const response = await axios.get(url);
        return {
            success: true,
            data: response.data.Infogempa.gempa,
            message: 'Data gempa terbaru berhasil diambil.',
        };
    } catch (error) {
        console.error(`[BMKG Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Gagal mengambil data gempa terbaru.',
        };
    }
};

module.exports = { fetchAutogempa };
