// const express = require("express");
// const connectDB = require("./config/db");

// const app = express();
// connectDB();

// app.use(express.json({ extended: false }));

// app.use("/api", require("./routes/issueRoutes"));
// app.use("/api", require("./routes/userRoutes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
// Connect to MongoDB
connectDB();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Enable CORS for all origins

// Use the user routes
app.use("/api", require("./routes/issueRoutes"));
app.use("/api", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
