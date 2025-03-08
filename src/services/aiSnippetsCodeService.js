const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

// Initialize Hugging Face API with API Key
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Creates a code snippet based on the provided query using Hugging Face.
 * @param {string} query - The query containing the request for the code snippet.
 * @returns {Object} - Contains success status and the generated code snippet.
 */
const createSnippet = async (query) => {
    const codeKeywords = ['buatkan kode', 'contoh kode', 'script', 'function', 'code snippet'];
    const isCodeRequest = codeKeywords.some((keyword) => query.toLowerCase().includes(keyword));

    if (isCodeRequest) {
        try {
            // Enhanced language detection, including programming languages and frameworks
            const detectedLanguage = query.match(/(php|python|javascript|java|c\+\+|c#|ruby|go|typescript|react|angular|vue|laravel|django|flask|swift|kotlin|rust|node.js|elixir|graphql|scala|ruby on rails)/i)?.[1] || "unspecified language";

            // Modify prompt to focus on returning only code
            const prompt = `
Generate only the code based on the following request: "${query}". 
The code must be in ${detectedLanguage} and only the valid code should be returned, no explanations or extra text.`;

            // Use Hugging Face model for text generation
            const result = await hf.textGeneration({
                model: 'Qwen/Qwen2.5-Coder-32B-Instruct', // Multi-language programming model
                inputs: prompt,
                parameters: {
                    max_length: 150, // Limit the length of the result
                    temperature: 0.3, // Reduce variation
                    top_p: 0.8, // Minimize irrelevant instructions
                },
            });

            const snippet = result.generated_text.trim();

            // Validate result
            if (!snippet || snippet.toLowerCase().includes("error")) {
                throw new Error("Generated output is invalid or empty.");
            }

            return {
                success: true,
                snippet: snippet,  // Only return the generated code snippet
            };
        } catch (error) {
            console.error('Error creating snippet:', error.message);
            return {
                success: false,
                message: `Failed to process the request: ${error.message}`,
            };
        }
    } else {
        return {
            success: false,
            message: 'Sorry, only code snippet requests are accepted.',
        };
    }
};

module.exports = { createSnippet };
