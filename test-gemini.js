// test-api.js
// Run this with: node test-api.js

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;

async function testAPI() {
  console.log("Testing Gemini API...");
  console.log("API Key:", API_KEY ? API_KEY.substring(0, 10) + "..." : "NOT FOUND");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say 'API is working!' in one sentence"
                }
              ]
            }
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ API Error:", data);
    } else {
      console.log("✅ API Working!");
      console.log("Response:", data.candidates[0].content.parts[0].text);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
}

testAPI();