const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function check() {
    const models = [
        "gemini-2.0-flash-lite",
        "gemini-flash-latest"
    ];

    console.log("Checking alternatives...");

    for (const m of models) {
        try {
            console.log(`Trying ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("Hi");
            console.log(`✅ SUCCESS: ${m}`);
        } catch (e) {
            console.log(`❌ FAIL: ${m} - ${e.message.split('\n')[0].substring(0, 100)}`);
        }
    }
}

check();
