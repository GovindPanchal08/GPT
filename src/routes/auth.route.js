const express = require("express");
const {
  registerHanlder,
  loginHandler,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", registerHanlder);
router.post("/login", loginHandler);

module.exports = router;
