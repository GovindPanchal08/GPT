const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
// const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
// const mongoSanitize = require("express-mongo-sanitize");
const authRoutes = require("./routes/auth.route");
const chatRoutes = require("./routes/chat.route");
const errorMiddleware = require("./middlewares/errorHandler");
const { rateLimitMiddleware } = require("./middlewares/rateLimit");

// app.disable("x-powered-by");
// app.set("trust proxy", 1);

app.use(cors());
// app.use(xss());
// app.use(mongoSanitize());
app.use(helmet());
app.use(compression());

app.use(rateLimitMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorMiddleware);
module.exports = app;
