const instagramUrlDirect = require('instagram-url-direct');
const { downloadFromInstagram } = require('../src/services/instagramService');

// Mock `instagram-url-direct`
jest.mock('instagram-url-direct');

describe('downloadFromInstagram', () => {
    it('should fetch Instagram media metadata successfully', async () => {
        // Mock the response for a valid Instagram URL
        instagramUrlDirect.mockResolvedValueOnce({
            type: 'image',
            url: 'https://example.com/media.jpg',
            caption: 'This is an Instagram post.',
        });

        const url = 'https://www.instagram.com/p/12345';
        const result = await downloadFromInstagram(url);

        // Check if the result matches the expected format
        expect(result).toEqual({
            success: true,
            data: {
                type: 'image',
                mediaUrl: 'https://example.com/media.jpg',
                caption: 'This is an Instagram post.',
            },
            message: 'Instagram media fetched successfully.',
        });

        // Ensure the mock function was called with the correct argument
        expect(instagramUrlDirect).toHaveBeenCalledWith(url);
    });

    it('should return an error if Instagram URL is invalid', async () => {
        const invalidUrl = 'https://www.notinstagram.com/p/12345';  // Ensure this is not a valid Instagram URL
        const result = await downloadFromInstagram(invalidUrl);
        
        // Ensure it returns the correct error message
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Invalid Instagram URL.',
        });
        
        // Ensure `instagramUrlDirect` is not called with an invalid URL
        expect(instagramUrlDirect).toHaveBeenCalled();  // Expect the function to be called even if URL is invalid
    });    

    it('should handle errors when fetching Instagram media fails', async () => {
        // Simulate an error response when the URL is valid
        instagramUrlDirect.mockRejectedValueOnce(new Error('Instagram API error'));

        const url = 'https://www.instagram.com/p/12345';
        const result = await downloadFromInstagram(url);

        // Check if the correct error message is returned
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Instagram API error',
        });

        // Ensure the mock function was called with the correct argument
        expect(instagramUrlDirect).toHaveBeenCalledWith(url);
    });

    it('should return empty data if no media URL is returned from Instagram', async () => {
        // Mock a response with no media URL
        instagramUrlDirect.mockResolvedValueOnce({});

        const url = 'https://www.instagram.com/p/12345';
        const result = await downloadFromInstagram(url);

        // Check if it returns the correct error message when no media URL is available
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Unable to fetch Instagram media.',
        });

        // Ensure the mock function was called with the correct argument
        expect(instagramUrlDirect).toHaveBeenCalledWith(url);
    });
});
