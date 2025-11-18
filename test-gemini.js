import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

console.log("API Key (first 20 chars):", API_KEY?.substring(0, 20) + "...");

const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
    try {
        console.log("\nTesting Gemini API...");
        
        // Test with gemini-pro first
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro"
        });

        const result = await model.generateContent("Say hello in one word");
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ API working! Response:", text);
        
        // Now list available models
        console.log("\nListing available models...");
        const models = await genAI.listModels();
        console.log("Available models:");
        for await (const model of models) {
            console.log(`- ${model.name}`);
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Full error:", error);
    }
}

testGemini();