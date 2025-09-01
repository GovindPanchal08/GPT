const chatModel = require("../models/chat.model");
async function chatHandler(req, res) {
  try {
    const { title } = req.body;
    if (!title || title.trim() == "") {
      return res.status(400).json({ message: "Title is required" });
    }
    const chat = await chatModel.create({
      user: req.user._id,
      title,
    });
    res.status(201).json({
      message: "Chat created successfully",
      chat: {
        id: chat._id,
        title: chat.title,
        user: chat.user,
        lastActivity: chat.lastActivity,
      },
    });
  } catch (error) {
    console.error("Error in chatHandler:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { chatHandler };
