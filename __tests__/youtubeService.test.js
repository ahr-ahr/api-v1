const ytdl = require('ytdl-core');
const { downloadFromYouTube } = require('../src/services/youtubeService');

// Mock `ytdl-core`
jest.mock('ytdl-core');

describe('downloadFromYouTube', () => {
    it('should fetch YouTube video metadata successfully', async () => {
        // Mock `ytdl-core` responses for a valid URL
        ytdl.validateURL.mockReturnValue(true); // Valid URL
        ytdl.getInfo.mockResolvedValue({
            videoDetails: {
                title: 'Amazing YouTube Video',
                author: { name: 'YouTube Creator' },
                description: 'This is an amazing YouTube video.',
                lengthSeconds: '300',
                thumbnails: [
                    { url: 'https://example.com/thumbnail.jpg' },
                    { url: 'https://example.com/thumbnail2.jpg' },
                ],
            },
            formats: [
                { hasVideo: true, hasAudio: false, qualityLabel: '720p', height: 720, url: 'https://video-url.com/720p' },
                { hasAudio: true, hasVideo: false, audioBitrate: 128, audioCodec: 'mp3', url: 'https://audio-url.com/128kbps' },
                { hasAudio: true, hasVideo: false, audioBitrate: 64, url: 'https://audio-url.com/64kbps' },
            ],
        });

        const url = 'https://www.youtube.com/watch?v=8SbUC-UaAxE';
        const result = await downloadFromYouTube(url);

        expect(result).toEqual({
            success: true,
            data: {
                title: 'Amazing YouTube Video',
                author: 'YouTube Creator',
                description: 'This is an amazing YouTube video.',
                duration: '300',
                thumbnail: 'https://example.com/thumbnail2.jpg',
                videoFormats: [
                    { 
                        quality: '720p',
                        resolution: '720p',
                        url: 'https://video-url.com/720p',
                    },
                ],
                audioFormats: [
                    { 
                        bitrate: 128,
                        codec: 'mp3',
                        url: 'https://audio-url.com/128kbps',
                    },
                    { 
                        bitrate: 64,
                        codec: 'mp3', // Default codec
                        url: 'https://audio-url.com/64kbps',
                    },
                ],
            },
            message: 'YouTube video metadata fetched successfully.',
        });

        // Ensure the mocks were called with the correct arguments
        expect(ytdl.validateURL).toHaveBeenCalledWith(url);
        expect(ytdl.getInfo).toHaveBeenCalledWith(url);
    });

    it('should return an error if YouTube URL is invalid', async () => {
        // Mock `ytdl-core` to invalidate URL
        ytdl.validateURL.mockReturnValue(false); // Invalid URL

        const url = 'https://www.notyoutube.com/watch?v=abcd1234';
        const result = await downloadFromYouTube(url);

        // Ensure the correct response is returned for invalid URLs
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Invalid YouTube URL.',
        });
        expect(ytdl.validateURL).toHaveBeenCalledWith(url);
    });

    it('should handle errors when fetching YouTube metadata fails', async () => {
        // Mock `ytdl-core` to simulate an error (for valid URL)
        ytdl.validateURL.mockReturnValue(true); // Valid URL
        ytdl.getInfo.mockRejectedValue(new Error('YouTube API error')); // Simulate an API error

        const url = 'https://www.youtube.com/watch?v=abcd1234';
        const result = await downloadFromYouTube(url);

        // Ensure the correct error message is returned
        expect(result).toEqual({
            success: false,
            data: null,
            message: 'YouTube API error',
        });

        // Ensure the mocks were called with the correct arguments
        expect(ytdl.validateURL).toHaveBeenCalledWith(url);
        expect(ytdl.getInfo).toHaveBeenCalledWith(url);
    });

    it('should return empty video and audio formats if none are available', async () => {
        // Mock `ytdl-core` responses for a valid URL with no video or audio formats
        ytdl.validateURL.mockReturnValue(true); // Valid URL
        ytdl.getInfo.mockResolvedValue({
            videoDetails: {
                title: 'Video with No Formats',
                author: { name: 'No Formats' },
                description: 'This video has no video or audio formats.',
                lengthSeconds: '150',
                thumbnails: [
                    { url: 'https://example.com/noformats-thumbnail.jpg' },
                ],
            },
            formats: [],
        });

        const url = 'https://www.youtube.com/watch?v=12345';
        const result = await downloadFromYouTube(url);

        expect(result).toEqual({
            success: true,
            data: {
                title: 'Video with No Formats',
                author: 'No Formats',
                description: 'This video has no video or audio formats.',
                duration: '150',
                thumbnail: 'https://example.com/noformats-thumbnail.jpg',
                videoFormats: [],
                audioFormats: [],
            },
            message: 'YouTube video metadata fetched successfully.',
        });

        // Ensure the mocks were called with the correct arguments
        expect(ytdl.validateURL).toHaveBeenCalledWith(url);
        expect(ytdl.getInfo).toHaveBeenCalledWith(url);
    });
});
