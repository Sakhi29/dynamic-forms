const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");
const axios = require("axios");

const credentialsPath = path.join(__dirname, "../config/service-account.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

async function authorize() {
  const { client_email, private_key } = credentials;
  const auth = new google.auth.JWT(client_email, null, private_key, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);
  return auth;
}

async function syncData() {
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });

  const SPREADSHEET_ID = process.env.ID;
  const range = "Sheet1!A1";

  let rows;
  try {
    const response = await axios.get("http://localhost:3000/data");
    rows = response.data.map((entry) => [
      entry.name,
      entry.country_code,
      entry.phone_number,
    ]);
  } catch (error) {
    console.error("Error fetching data from server:", error.message);
    return;
  }

  const resource = {
    values: [["Name", "Country Code", "Phone Number"], ...rows],
  };

  try {
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "RAW",
      resource,
    });

    console.log("%d cells updated.", result.data.updatedCells);
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
  }
}

syncData().catch(console.error);
