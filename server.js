/**
 * FixElite Application Server
 * Serves FixElite API routes and static frontend web assets.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const apiRouter = require('./backend/routes/api');
const { loadDB } = require('./backend/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static frontend assets
app.use(express.static(__dirname));

// Mount Modular Backend API Routes
app.use('/api', apiRouter);

// Fallback HTML page router
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  const mohitAppPath = path.join(__dirname, 'mohitapp.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else if (fs.existsSync(mohitAppPath)) {
    res.sendFile(mohitAppPath);
  } else {
    res.status(404).send('FixElite Frontend App HTML file not found');
  }
});

// Ensure Database file initialized on startup
loadDB();

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 FixElite Backend Engine running at http://localhost:${PORT}`);
  console.log(`==================================================`);
});
