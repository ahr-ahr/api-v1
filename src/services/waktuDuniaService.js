const axios = require('axios');

/**
 * Mengambil waktu dunia berdasarkan zona waktu
 * @param {string} timezone - Zona waktu (contoh: Asia/Jakarta)
 * @returns {Object} Waktu dunia
 */
const fetchWaktuDunia = async (timezone, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(`https://worldtimeapi.org/api/timezone/${timezone}`, {
                timeout: 5000, // Timeout setelah 5 detik
            });

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    message: `Waktu dunia untuk zona waktu ${timezone} berhasil diambil.`,
                };
            }
        } catch (error) {
            if (error.response?.status === 429 && attempt < retries) {
                console.log(`Percobaan ${attempt} gagal. Menunggu sebelum retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Error fetching world time:', error.message);
                return {
                    success: false,
                    data: null,
                    message: `Gagal mengambil waktu dunia untuk zona waktu ${timezone}. Error: ${error.message}`,
                };
            }
        }
    }
    return {
        success: false,
        data: null,
        message: `Gagal mengambil waktu dunia untuk zona waktu ${timezone} setelah beberapa percobaan.`,
    };
};

module.exports = { fetchWaktuDunia };
