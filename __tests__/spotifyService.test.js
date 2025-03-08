const spotifyUrlInfo = require('spotify-url-info');
const { downloadFromSpotify } = require('../src/services/spotifyService');

jest.mock('spotify-url-info', () => ({
  getPreview: jest.fn(),
  getData: jest.fn(),
}));

describe('downloadFromSpotify', () => {

    it('should fetch Spotify media metadata successfully', async () => {
        spotifyUrlInfo.getPreview.mockResolvedValueOnce({
            title: 'Song Title',
            artist: 'Artist Name',
            image: 'https://example.com/thumbnail.jpg',
            audio: 'https://example.com/preview.mp3',
        });

        spotifyUrlInfo.getData.mockResolvedValueOnce({
            name: 'Song Title',
            type: 'track',
            artists: [{ name: 'Artist Name' }],
            images: [{ url: 'https://example.com/thumbnail.jpg' }],
            external_urls: {
                spotify: 'https://open.spotify.com/track/12345',
            },
        });

        const url = 'https://open.spotify.com/track/12345';
        const result = await downloadFromSpotify(url);

        expect(result).toEqual({
            success: true,
            data: {
                title: 'Song Title',
                type: 'track',
                artist: 'Artist Name',
                thumbnail: 'https://example.com/thumbnail.jpg',
                description: null,
                externalUrls: {
                    spotify: 'https://open.spotify.com/track/12345',
                },
                mediaUrl: 'https://example.com/preview.mp3',
            },
            message: 'Spotify media fetched successfully.',
        });

        expect(spotifyUrlInfo.getPreview).toHaveBeenCalledWith(url);
        expect(spotifyUrlInfo.getData).toHaveBeenCalledWith(url);
    });

    it('should return an error if the Spotify URL is invalid', async () => {
        const url = 'https://invalid-url.com';
        const result = await downloadFromSpotify(url);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid Spotify URL.');
    });

    it('should return an error if preview data is not available', async () => {
        spotifyUrlInfo.getPreview.mockResolvedValueOnce(null);

        const url = 'https://open.spotify.com/track/12345';
        const result = await downloadFromSpotify(url);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Unable to fetch Spotify preview data.');
    });

    it('should return an error if there is an error fetching data from Spotify', async () => {
        spotifyUrlInfo.getPreview.mockResolvedValueOnce({
            title: 'Song Title',
            artist: 'Artist Name',
            image: 'https://example.com/thumbnail.jpg',
            audio: 'https://example.com/preview.mp3',
        });

        spotifyUrlInfo.getData.mockRejectedValueOnce(new Error('Failed to fetch data from Spotify'));

        const url = 'https://open.spotify.com/track/12345';
        const result = await downloadFromSpotify(url);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Failed to fetch data from Spotify');
    });

    it('should return empty data if no external URLs or media URL are found', async () => {
        spotifyUrlInfo.getPreview.mockResolvedValueOnce({
            title: 'Song Title',
            artist: 'Artist Name',
            image: 'https://example.com/thumbnail.jpg',
            audio: null,
        });
    
        spotifyUrlInfo.getData.mockResolvedValueOnce({
            name: 'Song Title',
            type: 'track',
            artists: [{ name: 'Artist Name' }],
            images: [{ url: 'https://example.com/thumbnail.jpg' }],
            external_urls: {},
        });
    
        const url = 'https://open.spotify.com/track/12345';
        const result = await downloadFromSpotify(url);
    
        expect(result).toEqual({
            success: true,
            data: {
                title: 'Song Title',
                type: 'track',
                artist: 'Artist Name',
                thumbnail: 'https://example.com/thumbnail.jpg',
                description: null,
                externalUrls: null,
                mediaUrl: null,
            },
            message: 'Spotify media fetched successfully.',
        });
    
        expect(spotifyUrlInfo.getPreview).toHaveBeenCalledWith(url);
        expect(spotifyUrlInfo.getData).toHaveBeenCalledWith(url);
    });

});
