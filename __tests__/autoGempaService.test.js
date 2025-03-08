const { fetchAutogempa } = require('../src/services/autoGempaService'); // Sesuaikan path file
const axios = require('axios');

// Mock axios untuk menghindari permintaan HTTP langsung
jest.mock('axios');

describe('fetchAutogempa', () => {
    it('should fetch the latest earthquake data successfully', async () => {
        // Mock respons JSON dari BMKG
        const mockResponse = {
            Infogempa: {
                gempa: {
                    Tanggal: '27 Nov 2024',
                    Jam: '07:30:00 WIB',
                    Magnitude: '5.2',
                    Kedalaman: '10 km',
                    Wilayah: 'Jawa Barat',
                    Koordinat: '-6.75, 106.56',
                    Potensi: 'Tidak berpotensi tsunami',
                },
            },
        };

        axios.get.mockResolvedValue({ data: mockResponse });

        const result = await fetchAutogempa();

        expect(result).toEqual({
            success: true,
            data: {
                Tanggal: '27 Nov 2024',
                Jam: '07:30:00 WIB',
                Magnitude: '5.2',
                Kedalaman: '10 km',
                Wilayah: 'Jawa Barat',
                Koordinat: '-6.75, 106.56',
                Potensi: 'Tidak berpotensi tsunami',
            },
            message: 'Data gempa terbaru berhasil diambil.',
        });
    });

    it('should return an error if BMKG URL is inaccessible', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        const result = await fetchAutogempa();

        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Network Error',
        });
    });

    it('should return an error if BMKG response is invalid', async () => {
        // Mock respons yang tidak sesuai dengan struktur JSON yang diharapkan
        const invalidResponse = { invalidKey: 'invalidData' };
        axios.get.mockResolvedValue({ data: invalidResponse });

        const result = await fetchAutogempa();

        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Cannot read properties of undefined (reading \'gempa\')',
        });
    });
});
