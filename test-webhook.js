// Node 20+ has native fetch, no need for node-fetch
async function testWebhook() {
    const payload = {
        english: {
            title: "Test News Entry " + new Date().getTime(),
            content: "This is a test content for the news entry via local script.",
            excerpt: "Local test excerpt.",
            tags: ["test", "local", "verification"],
            published: true,
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
        }
    };

    console.log("🚀 Sending test request to /api/news/webhook...");

    try {
        const response = await fetch('http://localhost:3000/api/news/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ SUCCESS!");
            console.log("Data:", JSON.stringify(data, null, 2));
        } else {
            console.log("❌ FAILED!");
            console.log("Status:", response.status);
            console.log("Error:", data.error);
        }
    } catch (error) {
        console.error("❌ CONNECTION ERROR!");
        console.error("Make sure your Next.js server is running (npm run dev)");
        console.error(error.message);
    }
}

testWebhook();
