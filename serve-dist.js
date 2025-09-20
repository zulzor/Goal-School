const express = require('express');
const path = require('path');

const app = express();
const PORT = 3005;

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the main index.html for all routes (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Production server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from ${path.join(__dirname, 'dist')}`);
  console.log(`⏹️  Press Ctrl+C to stop`);
});