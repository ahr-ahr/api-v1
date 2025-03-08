const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * Fetch kode wilayah cuaca berdasarkan nama wilayah
 * @param {string} query - Nama wilayah yang ingin dicari
 * @returns {Object} Hasil pencarian kode wilayah
 */
const fetchKodeWilayah = async (query) => {
    try {
        const url = 'https://raw.githubusercontent.com/kodewilayah/permendagri-72-2019/main/dist/base.csv';
        const response = await axios.get(url);

        // Konversi CSV ke stream untuk parsing
        const stream = Readable.from(response.data);
        const results = [];

        // Parse CSV
        return new Promise((resolve, reject) => {
            stream
                .pipe(csv({ headers: ['kode', 'nama'] })) // Mapping kolom CSV (sesuaikan jika ada kolom tambahan)
                .on('data', (data) => {
                    // Pastikan data memiliki properti nama sebelum diproses
                    if (data.nama && data.nama.toLowerCase().includes(query.toLowerCase())) {
                        results.push({
                            kode: data.kode, // Kolom kode wilayah
                            nama: data.nama, // Kolom nama wilayah
                        });
                    }
                })
                .on('end', () => {
                    if (results.length > 0) {
                        resolve({
                            success: true,
                            data: results,
                            message: 'Lokasi kelurahan/desa: menggunakan kode wilayah administrasi tingkat IV dari data kode wilayah.',
                        });
                    } else {
                        resolve({
                            success: false,
                            data: null,
                            message: 'Tidak ada data yang sesuai dengan kata kunci pencarian.',
                        });
                    }
                })
                .on('error', (error) => {
                    reject({
                        success: false,
                        data: null,
                        message: error.message || 'Gagal memproses data CSV.',
                    });
                });
        });
    } catch (error) {
        console.error(`[Kode Wilayah Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Gagal mengambil data kode wilayah.',
        };
    }
};

module.exports = { fetchKodeWilayah };
