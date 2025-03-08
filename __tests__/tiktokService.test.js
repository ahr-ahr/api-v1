const axios = require('axios');
const { downloadFromTikTok } = require('../src/services/tiktokService');

// Mocking the axios GET request
jest.mock('axios');

describe('downloadFromTikTok', () => {
    it('should fetch TikTok video details successfully', async () => {
        // Mocking the response for a valid TikTok URL
        axios.get.mockResolvedValueOnce({
            data: {
                data: {
                    play: 'https://example.com/video.mp4', // Video without watermark
                    music: 'https://example.com/music.mp3', // Music URL
                    cover: 'https://example.com/thumbnail.jpg', // Thumbnail image
                    author: {
                        nickname: 'author_name', // Author's nickname
                    },
                },
            },
        });

        const url = 'https://www.tiktok.com/@author_name/video/1234567890';
        const result = await downloadFromTikTok(url);

        // Check if the result matches the expected format
        expect(result).toEqual({
            success: true,
            data: {
                videoUrl: 'https://example.com/video.mp4',
                musicUrl: 'https://example.com/music.mp3',
                thumbnail: 'https://example.com/thumbnail.jpg',
                author: 'author_name',
            },
            message: 'TikTok video fetched successfully.',
        });

        // Ensure the mock function was called with the correct URL
        expect(axios.get).toHaveBeenCalledWith('https://tikwm.com/api/', { params: { url } });
    });

    it('should handle errors when the API response structure is invalid', async () => {
        // Mocking an invalid response (missing data)
        axios.get.mockResolvedValueOnce({
            data: {},
        });

        const url = 'https://www.tiktok.com/@author_name/video/1234567890';
        const result = await downloadFromTikTok(url);

        // Check if the result is an error due to invalid response structure
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Invalid response structure from TikWM API.',
        });

        // Ensure the mock function was called with the correct URL
        expect(axios.get).toHaveBeenCalledWith('https://tikwm.com/api/', { params: { url } });
    });

    it('should handle errors when fetching TikTok video fails', async () => {
        // Simulate an error in the API request
        axios.get.mockRejectedValueOnce(new Error('TikTok API error'));

        const url = 'https://www.tiktok.com/@author_name/video/1234567890';
        const result = await downloadFromTikTok(url);

        // Check if the error message matches
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'TikTok API error',
        });

        // Ensure the mock function was called with the correct URL
        expect(axios.get).toHaveBeenCalledWith('https://tikwm.com/api/', { params: { url } });
    });

    it('should return empty data if no author information is available', async () => {
        // Mock a response where author information is missing
        axios.get.mockResolvedValueOnce({
            data: {
                data: {
                    play: 'https://example.com/video.mp4',
                    music: 'https://example.com/music.mp3',
                    cover: 'https://example.com/thumbnail.jpg',
                    author: {},
                },
            },
        });

        const url = 'https://www.tiktok.com/@author_name/video/1234567890';
        const result = await downloadFromTikTok(url);

        // Check if the result handles missing author information
        expect(result).toEqual({
            success: true,
            data: {
                videoUrl: 'https://example.com/video.mp4',
                musicUrl: 'https://example.com/music.mp3',
                thumbnail: 'https://example.com/thumbnail.jpg',
                author: 'Unknown', // Author fallback
            },
            message: 'TikTok video fetched successfully.',
        });

        // Ensure the mock function was called with the correct URL
        expect(axios.get).toHaveBeenCalledWith('https://tikwm.com/api/', { params: { url } });
    });
});
