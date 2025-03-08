const { createSnippet } = require('../services/aiSnippetsCodeService');
const { HfInference } = require('@huggingface/inference');

// Mock Hugging Face Inference API
jest.mock('@huggingface/inference');

describe('createSnippet', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should generate a valid code snippet for a valid code query', async () => {
        // Mock Hugging Face API response
        const mockGeneratedText = 'echo "Hello, World!";'; // Mocked PHP code snippet
        HfInference.mockImplementationOnce(() => ({
            textGeneration: jest.fn().mockResolvedValue({
                generated_text: mockGeneratedText,
            }),
        }));

        const query = 'buatkan kode php untuk menampilkan Hello World';
        const result = await createSnippet(query);

        expect(result.success).toBe(true);
        expect(result.snippet).toBe('echo "Hello, World!";');
    });

    it('should return an error if the query is not about code', async () => {
        const query = 'what is the weather today';
        const result = await createSnippet(query);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Sorry, only code snippet requests are accepted.');
    });

    it('should return an error if Hugging Face API fails', async () => {
        // Simulate an error from Hugging Face API
        HfInference.mockImplementationOnce(() => ({
            textGeneration: jest.fn().mockRejectedValue(new Error('Hugging Face API error')),
        }));

        const query = 'buatkan kode php untuk menampilkan Hello World';
        const result = await createSnippet(query);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Failed to process the request: Hugging Face API error');
    });

    it('should return a default error message if no code is generated', async () => {
        // Simulate a response with empty generated text
        HfInference.mockImplementationOnce(() => ({
            textGeneration: jest.fn().mockResolvedValue({
                generated_text: '',
            }),
        }));

        const query = 'buatkan kode php untuk menampilkan Hello World';
        const result = await createSnippet(query);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Generated output is invalid or empty.');
    });

    it('should correctly detect and process various languages/frameworks in the query', async () => {
        const query = 'buatkan kode laravel untuk menampilkan halaman';
        const mockGeneratedText = 'return view("welcome");'; // Mocked Laravel code snippet

        HfInference.mockImplementationOnce(() => ({
            textGeneration: jest.fn().mockResolvedValue({
                generated_text: mockGeneratedText,
            }),
        }));

        const result = await createSnippet(query);

        expect(result.success).toBe(true);
        expect(result.snippet).toBe('return view("welcome");');
    });

    it('should return a fallback language if no programming language is detected', async () => {
        const query = 'buatkan kode untuk halaman HTML';
        const mockGeneratedText = '<html><body>Welcome</body></html>'; // Mocked HTML code snippet

        HfInference.mockImplementationOnce(() => ({
            textGeneration: jest.fn().mockResolvedValue({
                generated_text: mockGeneratedText,
            }),
        }));

        const result = await createSnippet(query);

        expect(result.success).toBe(true);
        expect(result.snippet).toBe('<html><body>Welcome</body></html>');
    });
});
