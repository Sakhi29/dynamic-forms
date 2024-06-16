const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
