const express = require("express");
const fs = require("fs");

const router = express.Router();

const DATA_FILE = "./ratings.json";

// Load data
function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save data
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/*
POST /api/ratings/:itemId
*/
router.post("/:itemId", (req, res) => {
    const { itemId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            error: "Rating must be between 1 and 5"
        });
    }

    const data = loadData();

    if (!data[itemId]) {
        data[itemId] = { ratings: [] };
    }

    data[itemId].ratings.push(rating);

    saveData(data);

    res.json({
        message: "Rating submitted successfully",
        itemId,
        rating
    });
});

/*
GET /api/ratings/:itemId
*/
router.get("/:itemId", (req, res) => {
    const { itemId } = req.params;

    const data = loadData();
    const item = data[itemId];

    if (!item || item.ratings.length === 0) {
        return res.status(404).json({
            error: "No ratings found"
        });
    }

    const sum = item.ratings.reduce((a, b) => a + b, 0);
    const avg = sum / item.ratings.length;

    res.json({
        itemId,
        averageRating: Number(avg.toFixed(2)),
        totalRatings: item.ratings.length
    });
});

module.exports = router;