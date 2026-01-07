const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API Key");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else if (json.models) {
                const lines = json.models
                    .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                    .map(m => m.name)
                    .join('\n');
                fs.writeFileSync('models.txt', lines);
                console.log("Wrote models to models.txt");
            } else {
                console.log("No models found or unexpected format");
                console.log(data.substring(0, 500));
            }
        } catch (e) {
            console.error("Parse error", e);
            console.log(data);
        }
    });
}).on('error', (err) => {
    console.error("Request error", err);
});
