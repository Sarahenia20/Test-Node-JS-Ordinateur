const Chat = require("../models/Chat");

// Create a new chat message
exports.createMessage = async (req, res) => {
  try {
    const { username, message } = req.body;
    const chat = new Chat({ username, message });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Retrieve all chat messages
exports.getMessages = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ date: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
