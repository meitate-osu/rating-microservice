const API_URL = "http://127.0.0.1:4000";

// Helper function to POST a rating
async function submitRating(itemId, rating) {
    const res = await fetch(`${API_URL}/api/ratings/${itemId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ rating })
    });

    const data = await res.json();
    console.log("POST Response:", data);
}

// Helper function to GET average rating
async function getAverage(itemId) {
    const res = await fetch(`${API_URL}/api/ratings/${itemId}`);

    const data = await res.json();
    console.log("GET Average Response:", data);
}

// Run tests in sequence
async function runTests() {
    const itemId = "img123";

    console.log("\n--- Submitting Ratings ---");

    await submitRating(itemId, 5);
    await submitRating(itemId, 4);
    await submitRating(itemId, 3);

    console.log("\n--- Fetching Average ---");

    await getAverage(itemId);
}

runTests();