const express = require("express");

// Get routes to the variable
const router = require("./src/routes/index");

const app = express();

const port = 5000;

app.use(express.json());

// Create endpoint grouping and router
app.use("/api/v1/", router);

app.listen(port, () => console.log(`Listening on port ${port}`));
