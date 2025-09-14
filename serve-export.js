const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the 'web-export' directory
app.use(express.static(path.join(__dirname, 'web-export-local')));

// Serve the index.html file for all routes
// Serve the index.html file for all routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'web-export-local', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
