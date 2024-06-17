const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { exec } = require("child_process");
const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database("./db/database.sql");

db.run(`CREATE TABLE IF NOT EXISTS form_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_type TEXT,
    name TEXT,
    country_code TEXT,
    phone_number TEXT
)`);

app.post("/submit-form", (req, res) => {
  const { form_type, name, country_code, phone_number } = req.body;
  db.run(
    "INSERT INTO form_data (form_type, name, country_code, phone_number) VALUES (?, ?, ?, ?)",
    [form_type, name, country_code, phone_number],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

app.get("/data", (req, res) => {
  db.all("SELECT * FROM form_data", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Data fetch successful, now run the sync script
    exec("node server/scripts/syncData.js", (err, stdout, stderr) => {
      if (err) {
        console.error(`Exec error: ${err}`);
        // Send error response
        return res.status(500).json({ error: "Data synchronization failed" });
      }

      console.log(`stdout: ${stdout}`);
      // Append stdout message to response
      res.json({
        message: "Data synchronized successfully",
        stdout,
        data: rows,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
