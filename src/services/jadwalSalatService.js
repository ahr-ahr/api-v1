const axios = require('axios');

/**
 * Mengambil jadwal salat dari API Aladhan
 * @param {string} city - Nama kota
 * @param {string} country - Nama negara
 * @param {string} date - Tanggal dalam format YYYY-MM-DD
 * @returns {Object} Jadwal salat
 */
const fetchJadwalSalat = async (city, country, date) => {
    try {
        const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
            params: { city, country, method: 2, date },
        });

        const timings = response.data.data.timings;
        return {
            success: true,
            data: {
                fajr: timings.Fajr,
                sunrise: timings.Sunrise,
                dhuhr: timings.Dhuhr,
                asr: timings.Asr,
                maghrib: timings.Maghrib,
                isha: timings.Isha,
                imsak: timings.Imsak,
                sunset: timings.Sunset,
                midnight: timings.Midnight,
                firstThird: timings.Firstthird,
                lastThird: timings.Lastthird
            },
            message: `Jadwal salat untuk ${city}, ${country} pada ${date} berhasil diambil.`,
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: `Gagal mengambil jadwal salat untuk ${city}, ${country} pada ${date}.`,
        };
    }
};

module.exports = { fetchJadwalSalat };
