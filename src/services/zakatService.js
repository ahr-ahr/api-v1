/**
 * Menghitung zakat penghasilan dan tabungan
 * @param {number} income - Pendapatan bulanan
 * @param {number} savings - Tabungan
 * @param {number} nisab - Nilai nisab
 * @returns {Object} Hasil perhitungan zakat
 */
const calculateZakat = (income, savings, nisab) => {
    // Validasi input untuk memastikan data yang diberikan valid
    if (typeof income !== 'number' || income <= 0) {
        return {
            success: false,
            data: null,
            message: 'Pendapatan harus berupa angka positif.',
        };
    }
    if (typeof savings !== 'number' || savings < 0) {
        return {
            success: false,
            data: null,
            message: 'Tabungan harus berupa angka non-negatif.',
        };
    }
    if (typeof nisab !== 'number' || nisab <= 0) {
        return {
            success: false,
            data: null,
            message: 'Nisab harus berupa angka positif.',
        };
    }

    // Menghitung zakat penghasilan (2.5% dari pendapatan)
    const zakatPenghasilan = income * 0.025; // Zakat 2.5%

    // Menghitung zakat tabungan, hanya jika tabungan melebihi nisab
    const zakatTabungan = savings >= nisab ? savings * 0.025 : 0;

    // Total zakat adalah jumlah dari zakat penghasilan dan zakat tabungan
    const totalZakat = zakatPenghasilan + zakatTabungan;

    return {
        success: true,
        data: {
            zakatPenghasilan: zakatPenghasilan.toFixed(0),  // Menyederhanakan hasil ke bilangan bulat
            zakatTabungan: zakatTabungan.toFixed(0),        // Menyederhanakan hasil ke bilangan bulat
            totalZakat: totalZakat.toFixed(0),              // Menyederhanakan hasil ke bilangan bulat
        },
        message: 'Zakat berhasil dihitung.',
    };
};

module.exports = { calculateZakat };
