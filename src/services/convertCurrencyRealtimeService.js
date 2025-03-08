const axios = require('axios');

/**
 * Mengonversi mata uang dengan API real-time
 * @param {string} fromCurrency - Mata uang yang akan dikonversi.
 * @param {string} toCurrency - Mata uang tujuan konversi.
 * @param {number} amount - Jumlah yang akan dikonversi.
 * @returns {Promise<Object>} - Hasil konversi atau pesan error.
 */
const convertCurrencyRealtime = async (fromCurrency, toCurrency, amount) => {
    const apiKey = process.env.EXCHANGERATE_API_KEY; // Ganti dengan API Key Anda
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

    // Currency symbols mapping (optional, can be expanded as needed)
    const currencySymbols = {
        USD: '$',    // United States Dollar
        EUR: '€',    // Euro
        GBP: '£',    // British Pound
        JPY: '¥',    // Japanese Yen
        INR: '₹',    // Indian Rupee
        AUD: 'A$',   // Australian Dollar
        CAD: 'C$',   // Canadian Dollar
        CHF: 'CHF',  // Swiss Franc
        CNY: '¥',    // Chinese Yuan
        SEK: 'kr',   // Swedish Krona
        NZD: 'NZ$',  // New Zealand Dollar
        MXN: '$',    // Mexican Peso
        SGD: 'S$',   // Singapore Dollar
        HKD: 'HK$',  // Hong Kong Dollar
        NOK: 'kr',   // Norwegian Krone
        ZAR: 'R',    // South African Rand
        BRL: 'R$',   // Brazilian Real
        RUB: '₽',    // Russian Ruble
        AED: 'د.إ',  // UAE Dirham
        THB: '฿',    // Thai Baht
        MYR: 'RM',   // Malaysian Ringgit
        PHP: '₱',    // Philippine Peso
        IDR: 'Rp',   // Indonesian Rupiah
        KRW: '₩',    // South Korean Won
        TRY: '₺',    // Turkish Lira
        ARS: '$',    // Argentine Peso
        CLP: '$',    // Chilean Peso
        COP: '$',    // Colombian Peso
        VND: '₫',    // Vietnamese Dong
        EGP: 'ج.م',  // Egyptian Pound
        PKR: '₨',    // Pakistani Rupee
        TWD: 'NT$',  // Taiwan Dollar
        KWD: 'د.ك',  // Kuwaiti Dinar
        SAR: 'ر.س',  // Saudi Riyal
        BDT: '৳',    // Bangladeshi Taka
        UAH: '₴',    // Ukrainian Hryvnia
        PLN: 'zł',   // Polish Zloty
        HUF: 'Ft',   // Hungarian Forint
        ILS: '₪',    // Israeli New Shekel
        DKK: 'kr',   // Danish Krone
        BGN: 'лв',   // Bulgarian Lev
        HRK: 'kn',   // Croatian Kuna
        RON: 'lei',  // Romanian Leu
        KHR: '៛',    // Cambodian Riel
        GHS: '₵',    // Ghanaian Cedi
        QAR: 'ر.ق',  // Qatari Rial
        LKR: 'Rs',   // Sri Lankan Rupee
        MAD: 'د.م.',  // Moroccan Dirham
        BDT: '৳',    // Bangladeshi Taka
        JMD: '$',    // Jamaican Dollar
        PYG: '₲',    // Paraguayan Guarani
        MOP: 'MOP$', // Macanese Pataca
        CUP: '₱',    // Cuban Peso
        KZT: '₸',    // Kazakhstani Tenge
        TZS: 'TSh',  // Tanzanian Shilling
        LBP: 'ل.ل',  // Lebanese Pound
        RWF: 'Fr',   // Rwandan Franc
    };

    try {
        const response = await axios.get(url);

        if (response.data.result === 'error') {
            return {
                success: false,
                message: 'Error retrieving exchange rates.',
            };
        }

        // Mendapatkan nilai tukar untuk mata uang yang dituju
        const exchangeRate = response.data.conversion_rates[toCurrency];

        if (!exchangeRate) {
            return {
                success: false,
                message: `Conversion rate for ${toCurrency} not found.`,
            };
        }

        // Menghitung hasil konversi
        const result = amount * exchangeRate;

        // Format the result to two decimal places
        const formattedResult = `${currencySymbols[toCurrency] || toCurrency} ${result.toFixed(2)}`;

        return {
            success: true,
            result: formattedResult,
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            success: false,
            message: 'Gagal memproses permintaan konversi mata uang: ' + error.message,
        };
    }
};

module.exports = { convertCurrencyRealtime };
