/**
 * FixElite Database Helper Module
 */

const fs = require('fs');
const path = require('path');
const SEED_DATA = require('./seedData');

const DB_FILE = path.join(__dirname, '..', 'db.json');

/**
 * Load data from JSON database or fallback to seed data
 */
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    saveDB(SEED_DATA);
    return SEED_DATA;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database, using seed data instead:", err);
    return SEED_DATA;
  }
}

/**
 * Save data to JSON database
 */
function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

module.exports = {
  loadDB,
  saveDB,
  SEED_DATA,
  DB_FILE
};
