const { downloadFromReddit } = require('../src/services/redditService'); // Sesuaikan path file
const axios = require('axios');

// Mock axios untuk menghindari permintaan HTTP langsung
jest.mock('axios');

describe('downloadFromReddit', () => {
    it('should return an error for invalid Reddit URL', async () => {
        const invalidUrl = 'https://invalid-url.com';
        const result = await downloadFromReddit(invalidUrl);

        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Invalid Reddit URL. Please provide a valid post URL.',
        });
    });

    it('should fetch metadata and media URL for a valid Reddit post', async () => {
        const validUrl = 'https://www.reddit.com/r/moviecritic/comments/1gyt6bo/which_actoractress_death_was_a_great_loss_for_the/?rdt=47564';
        
        // Simulasikan respons HTML dari Reddit
        const html = `
            <html>
                <body>
                    <h1 id="post-title-t3_1gyt6bo">Example Title</h1>
                    <div id="description">This is an example description.</div>
                    <img id="post-image" src="https://example.com/image.jpg" />
                    <a class="subreddit-name" href="/r/example">r/example</a>
                </body>
            </html>
        `;

        // Mock respons axios
        axios.get.mockResolvedValue({ data: html });

        const result = await downloadFromReddit(validUrl);

        expect(result).toEqual({
            success: true,
            data: {
                title: 'Example Title',
                description: 'This is an example description.',
                mediaUrl: 'https://example.com/image.jpg',
                subreddit: 'r/example',
            },
            message: 'Reddit media fetched successfully.',
        });
    });

    it('should return an error if no media is found', async () => {
        const noMediaUrl = 'https://www.reddit.com/r/example/comments/def456/no_media_post';

        // Simulasikan respons HTML tanpa elemen media
        const html = `
            <html>
                <body>
                    <h1 id="post-title-t3_1gyt6bo">No Media Title</h1>
                    <div id="description">This post has no media.</div>
                    <a class="subreddit-name" href="/r/example">r/example</a>
                </body>
            </html>
        `;

        axios.get.mockResolvedValue({ data: html });

        const result = await downloadFromReddit(noMediaUrl);

        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Unable to fetch Reddit media. No media found in the provided URL.',
        });
    });

    it('should handle network errors gracefully', async () => {
        const errorUrl = 'https://www.reddit.com/r/example/comments/ghi789/error_post';
        
        // Mock error dari axios
        axios.get.mockRejectedValue(new Error('Network Error'));

        const result = await downloadFromReddit(errorUrl);

        expect(result).toEqual({
            success: false,
            data: null,
            message: 'Network Error',
        });
    });
});
