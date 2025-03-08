const axios = require('axios');
const dns = require('dns');
const https = require('https');

// Fungsi untuk mendapatkan geolokasi berdasarkan alamat IP
const getGeoLocation = async (ip) => {
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json`);
        const { city, region, country, loc, org, timezone } = response.data;
        return {
            city: city || 'Tidak diketahui',
            region: region || 'Tidak diketahui',
            country: country || 'Tidak diketahui',
            location: loc || 'Tidak diketahui',
            organization: org || 'Tidak diketahui',
            timezone: timezone || 'Tidak diketahui'
        };
    } catch (error) {
        return {
            city: 'Tidak diketahui',
            region: 'Tidak diketahui',
            country: 'Tidak diketahui',
            location: 'Tidak diketahui',
            organization: 'Tidak diketahui',
            timezone: 'Tidak diketahui'
        };
    }
};

/**
 * Memeriksa status server dan sertifikat SSL menggunakan API dari ssl-checker.io
 * @param {string} url - URL untuk diperiksa.
 * @returns {Object} - Status server dan informasi SSL.
 */
const checkServerStatus = async (url, port = 80) => {
    try {
        // Hapus protokol (http:// atau https://) dari URL
        const domain = cleanUrl(url);
        const fullUrl = `${url}:${port}`;
        const startTime = Date.now(); // Track the request start time
        
        // Resolve IP address (network-related info)
        const ipAddress = await resolveIpAddress(domain);

        // Memeriksa informasi SSL
        const sslInfo = port === 443 ? await checkSSL(domain) : null; // Cleaned URL passed to checkSSL
        const language = await detectServerLanguage(url);

        const response = await axios.get(fullUrl, { timeout: 5000 });
        const responseTime = Date.now() - startTime;

        // Extract additional headers
        const additionalHeaders = response.headers;
        const hstsHeader = additionalHeaders['strict-transport-security'];
        const xFrameOptions = additionalHeaders['x-frame-options'];
        const xContentTypeOptions = additionalHeaders['x-content-type-options'];
        const xXssProtection = additionalHeaders['x-xss-protection'];
        const contentSecurityPolicy = additionalHeaders['content-security-policy'];
        const referrerPolicy = additionalHeaders['referrer-policy'];
        const permissionsPolicy = additionalHeaders['permissions-policy'] || additionalHeaders['feature-policy'];
        const cacheControl = additionalHeaders['cache-control'];
        const pragma = additionalHeaders['pragma'];
        const xPermittedCrossDomainPolicies = additionalHeaders['x-permitted-cross-domain-policies'];

        // Geolokasi IP address
        const geoLocation = await getGeoLocation(ipAddress);

        // Memeriksa apakah WAF terdeteksi melalui header yang dikenal (contoh untuk Cloudflare)
        const cfRayHeader = additionalHeaders['cf-ray'] ? 'WAF Cloudflare terdeteksi' : 'Tidak ada WAF terdeteksi';

        // Return detailed status
        return {
            success: true,
            status: 'active',
            responseTime: responseTime,
            statusCode: response.status,
            message: 'Server is up and running.',
            date: new Date().toISOString(),
            headers: response.headers,
            server: response.headers['server'],
            contentType: response.headers['content-type'],
            transferEncoding: response.headers['transfer-encoding'],
            ipAddress: ipAddress,
            protocol: response.request.protocol,
            contentLength: response.headers['content-length'],
            bodyPreview: getPreviewOfBody(response.data),
            requestUrl: fullUrl,
            requestMethod: 'GET',
            serverTime: response.headers['date'],
            language: language, // Detected programming language
            hstsHeader: hstsHeader || 'Tidak diatur',
            xFrameOptions: xFrameOptions || 'Tidak diatur',
            xContentTypeOptions: xContentTypeOptions || 'Tidak diatur',
            xXssProtection: xXssProtection || 'Tidak diatur',
            contentSecurityPolicy: contentSecurityPolicy || 'Tidak diatur',
            referrerPolicy: referrerPolicy || 'Tidak diatur',
            permissionsPolicy: permissionsPolicy || 'Tidak diatur',
            cacheControl: cacheControl || 'Tidak diatur',
            pragma: pragma || 'Tidak diatur',
            xPermittedCrossDomainPolicies: xPermittedCrossDomainPolicies || 'Tidak diatur',
            geoLocation: geoLocation || 'Tidak diketahui',
            wafStatus: cfRayHeader,
            sslInfo: sslInfo || 'Tidak ada informasi SSL'
        };
    } catch (error) {
        let errorMessage = "Unknown error occurred.";

        if (error.response) {
            errorMessage = `Server returned status code: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'No response from the server.';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = `DNS lookup failed for domain: ${url}`;
        } else {
            errorMessage = `Error checking server: ${error.message}`;
        }

        return {
            success: false,
            status: 'inactive',
            message: errorMessage,
            date: new Date().toISOString(),
        };
    }
};

/**
 * Resolves the IP address of a given URL.
 * @param {string} url - The URL to resolve.
 * @returns {Promise<string>} - The resolved IP address.
 */
const resolveIpAddress = (url) => {
    return new Promise((resolve, reject) => {
        dns.lookup(url, (err, address) => {
            if (err) reject(err);
            else resolve(address);
        });
    });
};

/**
 * Menghapus http:// atau https:// dari URL untuk mendapatkan domain/subdomain saja.
 * @param {string} url - URL lengkap (dengan http/https).
 * @returns {string} - Domain/subdomain tanpa http:// atau https://.
 */
const cleanUrl = (url) => {
    return url.replace(/^https?:\/\//, ''); // Menghapus http:// atau https://
};

/**
 * Memeriksa informasi SSL menggunakan API dari ssl-checker.io
 * @param {string} url - URL untuk diperiksa SSL-nya.
 * @returns {Promise<Object|null>} - Informasi sertifikat SSL atau null jika tidak ditemukan.
 */
const checkSSL = async (url) => {
    try {
        // Menggunakan API dari ssl-checker.io untuk mendapatkan detail SSL
        const sslDetails = await axios.get(`https://ssl-checker.io/api/v1/check/${url}`);

        // Cek apakah respons mengandung hasil SSL yang valid
        if (sslDetails.data && sslDetails.data.result && sslDetails.data.result.cert_valid) {
            const result = sslDetails.data.result;

            // Menyusun format response sesuai yang diinginkan
            return {
                version: sslDetails.data.version,
                app: sslDetails.data.app,
                host: sslDetails.data.host,
                response_time_sec: sslDetails.data.response_time_sec,
                status: sslDetails.data.status,
                result: {
                    host: result.host,
                    resolved_ip: result.resolved_ip,
                    issued_to: result.issued_to,
                    issuer_c: result.issuer_c,
                    issuer_o: result.issuer_o || 'Unknown', // Jika issuer_o null, tampilkan Unknown
                    issuer_ou: result.issuer_ou,
                    issuer_cn: result.issuer_cn,
                    cert_sn: result.cert_sn,
                    cert_sha1: result.cert_sha1,
                    cert_alg: result.cert_alg,
                    cert_ver: result.cert_ver,
                    cert_sans: result.cert_sans,
                    cert_exp: result.cert_exp,
                    cert_valid: result.cert_valid,
                    valid_from: result.valid_from,
                    valid_till: result.valid_till,
                    validity_days: result.validity_days,
                    days_left: result.days_left,
                    valid_days_to_expire: result.valid_days_to_expire,
                    hsts_header_enabled: result.hsts_header_enabled
                }
            };
        } else {
            return null; // Jika tidak valid atau tidak ditemukan
        }
    } catch (err) {
        // Log error untuk debugging
        console.error("Error fetching SSL details:", err);
        return null; // Mengembalikan null jika ada kesalahan dalam mendapatkan data
    }
};

/**
 * Menentukan bahasa server berdasarkan header HTTP atau konten.
 * @param {string} url - URL untuk mendeteksi bahasa server.
 * @returns {Promise<string>} - Bahasa pemrograman yang digunakan oleh server.
 */
const detectServerLanguage = async (url) => {
    try {
        const response = await axios.get(url, { timeout: 5000 });
        const serverHeader = response.headers['x-powered-by'] || response.headers['server'];

        if (serverHeader) {
            if (serverHeader.includes('PHP')) return 'PHP';
            if (serverHeader.includes('Node.js')) return 'Node.js';
            if (serverHeader.includes('ASP.NET')) return 'ASP.NET';
            if (serverHeader.includes('Python')) return 'Python';
            if (serverHeader.includes('Ruby')) return 'Ruby';
        }

        return 'Unknown'; // Jika tidak ada bahasa yang terdeteksi
    } catch (err) {
        return 'Unknown'; // Jika terjadi kesalahan saat mendeteksi
    }
};

/**
 * Mendapatkan preview tubuh jika jenis kontennya berupa teks (HTML, JSON, dll).
 * @param {string|Object} body - Tubuh untuk dipreview.
 * @returns {string} - Teks preview.
 */
const getPreviewOfBody = (body) => {
    if (typeof body === 'string') {
        return body.length > 100 ? body.substring(0, 100) + '...' : body;
    } else if (typeof body === 'object') {
        return JSON.stringify(body).substring(0, 100) + '...';
    }
};

module.exports = { checkServerStatus };
