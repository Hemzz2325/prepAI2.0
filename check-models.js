const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("API KEY not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // There isn't a direct "listModels" on the client instance in some versions, 
        // but we can try a simple generation with a known fallback or valid model to test connectivity.
        // Actually, the best way to list models in node is usually via the REST API or if the SDK exposes it.
        // The node SDK doesn't always expose listModels directly on the main class in older versions, 
        // but checking the docs or trying a known one is better.

        // However, let's just try to generate with 'gemini-1.5-flash' to verify the error, 
        // and 'gemini-pro' to see if that works.

        const modelsToTest = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

        console.log("Testing specific models...");

        for (const modelName of modelsToTest) {
            try {
                console.log(`\nTesting ${modelName}:`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`Success! ${modelName} responded:`, result.response.text());
                // If success, we found a good one.
            } catch (e) {
                console.log(`Failed ${modelName}:`, e.message.split('\n')[0]);
            }
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();
