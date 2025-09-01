const jwt = require("jsonwebtoken");
function tokenGenerator(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
}

module.exports = tokenGenerator;
