const express = require("express");
const { chatHandler } = require("../controllers/chat.controller");
const authUser = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", authUser, chatHandler);

module.exports = router;
