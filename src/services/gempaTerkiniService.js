const axios = require('axios');

/**
 * Mengambil daftar 15 gempa bumi M 5.0+ terbaru dari BMKG
 * @returns {Object} Data daftar gempa bumi
 */
const fetchGempaterkini = async () => {
    try {
        const url = 'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';
        const response = await axios.get(url);
        return {
            success: true,
            data: response.data.Infogempa.gempa,
            message: 'Data gempa terkini berhasil diambil.',
        };
    } catch (error) {
        console.error(`[BMKG Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Gagal mengambil data gempa terkini.',
        };
    }
};

module.exports = { fetchGempaterkini };
