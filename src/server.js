
const express = require('express');
const path = require('path');
const messageApi = require('./api/messageApi');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// API routes
app.use('/api', messageApi);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// For any other route, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
