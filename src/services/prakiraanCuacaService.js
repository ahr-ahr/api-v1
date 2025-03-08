const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * Mengambil data prakiraan cuaca dari BMKG berdasarkan kode wilayah
 * @param {string} kodeWilayah - Kode wilayah tingkat IV
 * @returns {Object} Data prakiraan cuaca
 */
const fetchCuacaByWilayah = async (kodeWilayah) => {
    try {
        // Validasi apakah kode wilayah terdiri dari 4 bagian yang dipisahkan titik (misalnya: 35.78.11.1001)
        const regex = /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/;
        if (!regex.test(kodeWilayah)) {
            return {
                success: false,
                data: null,
                message: 'Kode wilayah harus terdiri dari 4 bagian yang dipisahkan titik, dengan format xx.xx.xx.xxxx.',
            };
        }

        // Ambil dan validasi kode wilayah dari CSV
        const validKodeWilayah = await validateKodeWilayah(kodeWilayah);
        if (!validKodeWilayah) {
            return {
                success: false,
                data: null,
                message: 'Kode wilayah tidak valid.',
            };
        }

        const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kodeWilayah}`;
        const response = await axios.get(url);

        return {
            success: true,
            data: response.data,
            message: 'Data prakiraan cuaca berhasil diambil.',
        };
    } catch (error) {
        console.error(`[BMKG Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Gagal mengambil data prakiraan cuaca.',
        };
    }
};

/**
 * Memvalidasi apakah kode wilayah terdapat dalam daftar kode wilayah yang valid dari CSV
 * @param {string} kodeWilayah - Kode wilayah yang akan divalidasi
 * @returns {boolean} True jika kode wilayah valid, False jika tidak
 */
const validateKodeWilayah = async (kodeWilayah) => {
    try {
        // Ambil file CSV dari URL
        const csvData = await axios.get('https://raw.githubusercontent.com/kodewilayah/permendagri-72-2019/main/dist/base.csv');

        // Gunakan Set untuk penyimpanan kode wilayah yang valid
        const validCodes = new Set();

        // Debug: Cek data CSV yang diambil
        //console.log('CSV Data:', csvData.data.slice(0, 200));  // Menampilkan sebagian kecil data untuk diperiksa

        // Membaca CSV dengan format yang lebih aman
        const lines = csvData.data.split('\n');
        
        // Mengolah setiap baris data
        for (const line of lines) {
            // Pisahkan setiap baris berdasarkan koma
            const columns = line.split(',');

            // Pastikan ada dua kolom (kode wilayah, nama wilayah)
            if (columns.length >= 2) {
                const kodeWilayahCSV = columns[0].trim();
                validCodes.add(kodeWilayahCSV);  // Menambahkan kode wilayah ke Set
            }
        }

        // Cek isi Set setelah proses
        //console.log('Isi Set validCodes:', Array.from(validCodes));

        // Cek apakah kode wilayah ada dalam Set
        return validCodes.has(kodeWilayah);

    } catch (error) {
        console.error('[CSV Error]: ', error);
        return false;
    }
};

module.exports = { fetchCuacaByWilayah };
