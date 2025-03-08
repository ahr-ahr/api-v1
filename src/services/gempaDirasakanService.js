const axios = require('axios');

/**
 * Membersihkan JSON dengan line break dan memastikan format valid.
 * @param {string} rawData Data mentah dengan line break
 * @returns {Object} Objek JSON yang sudah bersih
 */
const cleanJson = (rawData) => {
    try {
        // Hapus semua line break
        const cleanedData = rawData.replace(/\n/g, '');
        // Parse menjadi JSON
        return JSON.parse(cleanedData);
    } catch (error) {
        console.error('Gagal membersihkan JSON:', error.message);
        throw new Error('Format JSON tidak valid.');
    }
};

/**
 * Mengambil daftar 15 gempa bumi yang dirasakan dari BMKG
 * @returns {Object} Data gempa bumi yang dirasakan
 */
const fetchGempadirasakan = async () => {
    try {
        const url = 'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json';
        const response = await axios.get(url);

        console.log('Respons lengkap:', response);
        // Jika data mentah adalah string dengan line break
        const cleanedData = cleanJson(response.data);

        console.log('Data:', cleanedData);
        console.log('Infogempa:', cleanedData?.Infogempa);
        console.log('Gempa:', cleanedData?.Infogempa?.gempa);

        return {
            success: true,
            data: cleanedData.Infogempa.gempa,
            message: 'Data gempa dirasakan berhasil diambil.',
        };
    } catch (error) {
        console.error(`[BMKG Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Gagal mengambil data gempa dirasakan.',
        };
    }
};

module.exports = { fetchGempadirasakan };
