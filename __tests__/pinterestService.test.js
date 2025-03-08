const { downloadFromPinterest } = require('../src/services/pinterestService');
const axios = require('axios');

// Mock axios untuk testing
jest.mock('axios');

describe('downloadFromPinterest', () => {
    it('should fetch Pinterest media metadata successfully', async () => {
        const mockHtml = `
            <meta property="og:title" content="Beautiful Pin">
            <meta property="og:description" content="This is a beautiful pin.">
            <meta property="og:image" content="https://example.com/image.jpg">
        `;
        axios.get.mockResolvedValueOnce({ data: mockHtml });

        const result = await downloadFromPinterest('https://www.pinterest.com/pin/1234567890/');
        expect(result).toEqual({
            success: true,
            data: {
                title: 'Beautiful Pin',
                description: 'This is a beautiful pin.',
                imageUrl: 'https://example.com/image.jpg',
            },
            message: 'Pinterest media fetched successfully.',
        });
    });

    it('should return an error if the Pinterest URL is invalid', async () => {
        const result = await downloadFromPinterest('https://invalid-url.com');
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Invalid Pinterest URL.',
        });
    });

    it('should return an error if no imageUrl is found in the metadata', async () => {
        const mockHtml = `
            <meta property="og:title" content="Invalid Pin">
            <meta property="og:description" content="This is an invalid pin.">
        `;
        axios.get.mockResolvedValueOnce({ data: mockHtml });

        const result = await downloadFromPinterest('https://www.pinterest.com/pin/1234567890/');
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Unable to fetch Pinterest media.',
        });
    });

    it('should handle network or scraping errors gracefully', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network error'));

        const result = await downloadFromPinterest('https://www.pinterest.com/pin/1234567890/');
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Network error',
        });
    });
});
