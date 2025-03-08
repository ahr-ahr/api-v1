const { downloadFromFacebook } = require('../src/services/facebookService');
const axios = require('axios');

// Mock axios untuk testing
jest.mock('axios');

describe('downloadFromFacebook', () => {
    it('should fetch Facebook media metadata successfully', async () => {
        // Mock HTML yang digunakan untuk testing
        const mockHtml = `
            <meta property="og:title" content="Awesome Facebook Post">
            <meta property="og:description" content="This is a great post on Facebook.">
            <meta property="og:image" content="https://example.com/image.jpg">
        `;
        
        // Mock response axios
        axios.get.mockResolvedValueOnce({ data: mockHtml });

        // Memanggil fungsi dan melakukan assert
        const result = await downloadFromFacebook('https://www.facebook.com/somepage/posts/1234567890');
        expect(result).toEqual({
            success: true,
            data: {
                title: 'Awesome Facebook Post',
                description: 'This is a great post on Facebook.',
                imageUrl: 'https://example.com/image.jpg',
            },
            message: 'Facebook media fetched successfully.',
        });
    });

    it('should return an error if the Facebook URL is invalid', async () => {
        // Tes URL tidak valid
        const result = await downloadFromFacebook('https://invalid-url.com');
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Invalid Facebook URL.',
        });
    });

    it('should return an error if no imageUrl is found in the metadata', async () => {
        // Mock HTML tanpa URL gambar
        const mockHtml = `
            <meta property="og:title" content="No Image Post">
            <meta property="og:description" content="This post has no image.">
        `;
        
        // Mock response axios
        axios.get.mockResolvedValueOnce({ data: mockHtml });

        // Memanggil fungsi dan melakukan assert
        const result = await downloadFromFacebook('https://www.facebook.com/somepage/posts/1234567890');
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Unable to fetch Facebook media.',
        });
    });

    it('should handle network or scraping errors gracefully', async () => {
        // Mock kesalahan jaringan
        axios.get.mockRejectedValueOnce(new Error('Network error'));

        // Memanggil fungsi dan melakukan assert
        const result = await downloadFromFacebook('https://www.facebook.com/somepage/posts/1234567890');
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Network error',
        });
    });
});
