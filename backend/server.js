const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

const ratingsRoutes = require("./routes/ratings");

app.use(cors());
app.use(express.json());

// mount router correctly
app.use("/api/ratings", ratingsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});