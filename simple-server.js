const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8083; // Изменили порт на 8083

// Serve static files from web-export directory
app.use(express.static(path.join(__dirname, 'web-export')));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-export', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
