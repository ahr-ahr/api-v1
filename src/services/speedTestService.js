const { exec } = require('child_process');
const os = require('os'); // Untuk mendeteksi sistem operasi

/**
 * Menjalankan Speedtest menggunakan CLI dan mengembalikan hasilnya
 * @returns {Object} Data hasil speedtest
 */
const fetchSpeedtest = async () => {
    try {
        return new Promise((resolve, reject) => {
            let command;

            // Menentukan perintah berdasarkan sistem operasi
            if (os.platform() === 'win32') {
                // Untuk Windows
                command = 'C:\\ookla-speedtest\\speedtest.exe --accept-license --format=json';
            } else if (os.platform() === 'linux') {
                // Untuk Linux
                command = 'speedtest-cli --json';
            } else {
                reject({
                    success: false,
                    data: null,
                    message: 'Sistem operasi tidak didukung.',
                });
                return;
            }

            // Menjalankan perintah sesuai dengan sistem operasi
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[Speedtest Error]: ${error.message}`);
                    reject({
                        success: false,
                        data: null,
                        message: 'Gagal menjalankan speedtest.',
                    });
                    return;
                }

                if (stderr) {
                    console.error(`[Speedtest CLI Error]: ${stderr}`);
                    reject({
                        success: false,
                        data: null,
                        message: stderr,
                    });
                    return;
                }

                // Parsing hasil JSON dari Speedtest CLI
                try {
                    const result = JSON.parse(stdout);
                    resolve({
                        success: true,
                        data: {
                            type: result.type,
                            timestamp: result.timestamp,
                            ping: {
                                jitter: result.ping.jitter,
                                latency: result.ping.latency,
                                low: result.ping.low,
                                high: result.ping.high,
                            },
                            download: {
                                bandwidth: result.download.bandwidth / 125000, // Mbps
                                bytes: result.download.bytes,
                                elapsed: result.download.elapsed,
                                latency: result.download.latency,
                            },
                            upload: {
                                bandwidth: result.upload.bandwidth / 125000, // Mbps
                                bytes: result.upload.bytes,
                                elapsed: result.upload.elapsed,
                                latency: result.upload.latency,
                            },
                            packetLoss: result.packetLoss,
                            isp: result.isp,
                            interface: {
                                internalIp: result.interface.internalIp,
                                externalIp: result.interface.externalIp,
                                macAddr: result.interface.macAddr,
                                isVpn: result.interface.isVpn,
                            },
                            server: {
                                id: result.server.id,
                                host: result.server.host,
                                port: result.server.port,
                                name: result.server.name,
                                location: result.server.location,
                                country: result.server.country,
                                ip: result.server.ip,
                            },
                            result: {
                                id: result.result.id,
                                url: result.result.url,
                                persisted: result.result.persisted,
                            },
                        },
                        message: 'Speedtest berhasil dijalankan.',
                    });
                } catch (parseError) {
                    console.error(`[Parsing Error]: ${parseError.message}`);
                    reject({
                        success: false,
                        data: null,
                        message: 'Gagal memproses hasil Speedtest.',
                    });
                }
            });
        });
    } catch (error) {
        console.error(`[Error]: ${error.message}`);
        return {
            success: false,
            data: null,
            message: error.message || 'Terjadi kesalahan saat menjalankan Speedtest.',
        };
    }
};

module.exports = { fetchSpeedtest };
