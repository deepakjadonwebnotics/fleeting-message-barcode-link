
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Define the messages directory path
const messagesDir = path.join(__dirname, '..', 'messages');

// Ensure messages directory exists
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

// Create a new message
router.post('/messages', (req, res) => {
  try {
    const { id, content } = req.body;
    
    if (!id || !content) {
      return res.status(400).json({ error: 'ID and content are required' });
    }
    
    const filePath = path.join(messagesDir, `${id}.json`);
    
    // Save message to file
    fs.writeFileSync(filePath, JSON.stringify({ 
      id, 
      content,
      viewed: false,
      createdAt: new Date()
    }));
    
    return res.status(201).json({ id, success: true });
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({ error: 'Failed to create message' });
  }
});

// Get a message by ID
router.get('/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(messagesDir, `${id}.json`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Read message from file
    const messageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check if message has been viewed
    if (messageData.viewed) {
      return res.status(403).json({ error: 'Message has already been viewed' });
    }
    
    return res.json(messageData);
  } catch (error) {
    console.error('Error getting message:', error);
    return res.status(500).json({ error: 'Failed to get message' });
  }
});

// Mark a message as viewed
router.put('/messages/:id/viewed', (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(messagesDir, `${id}.json`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Read message from file
    const messageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Mark as viewed
    messageData.viewed = true;
    
    // Save updated message
    fs.writeFileSync(filePath, JSON.stringify(messageData));
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error marking message as viewed:', error);
    return res.status(500).json({ error: 'Failed to mark message as viewed' });
  }
});

module.exports = router;
