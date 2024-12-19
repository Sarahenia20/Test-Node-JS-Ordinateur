const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);
