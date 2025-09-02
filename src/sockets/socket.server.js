const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const userModel = require("../models/user.model");
const msgModel = require("../models/message.model");
const { aiChat, generateEmbeddings } = require("../services/ai.service");
const { queryMemory, createMemory } = require("../services/vector.service");
const { isRateLimited } = require("../middlewares/rateLimit");
const initailizeSocket = (httpServer) => {
  const io = new Server(httpServer, {});

  // io middleware to handle authentication
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decode.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("ai-msg", async (data) => {
      try {
        console.log("AI Message Received:", data);

        const rate = await isRateLimited({
          identifier: socket.user._id,
          eventName: "ai-msg",
          maxRequests: 5,
          windowSeconds: 10,
        });
        if (!rate) {
          socket.emit("rate-limit", {
            message: "Too Many Requests - Slow Down",
          });
          return;
        }
        const [msg, inputEmbedding] = await Promise.all([
          msgModel.create({
            user: socket.user._id,
            chat: data.chat,
            content: data.content,
            role: "user",
          }),

          await generateEmbeddings(data.content),
        ]);

        const [, memory] = await Promise.all([
          createMemory({
            vector: inputEmbedding,
            metadata: {
              chat: data.chat,
              user: socket.user._id,
              text: data.content,
            },
            messageId: msg._id,
          }),

          queryMemory({
            vector: inputEmbedding,
            topK: 3,
            metadata: {},
          }),
        ]);

        const chathistory = (
          await msgModel
            .find({ chat: data.chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
        ).reverse();

        let ltm = [
          {
            role: "user",
            parts: [
              {
                text: `you are a helpful AI assistant. You have access to the following information from the chat history: ${memory
                  .map((m) => m.metadata.text)
                  .join("\n")}`,
              },
            ],
          },
        ];
        let stm = chathistory?.map((msg) => {
          return {
            role: msg.role,
            parts: [{ text: msg.content }],
          };
        });

        // console.log("stm:", stm);
        const response = await aiChat([...ltm, ...stm]);

        socket.emit("ai-response", response);

        const [aiMsg, outputEmbeddings] = await Promise.all([
          msgModel.create({
            user: socket.user._id,
            chat: data.chat,
            content: response,
            role: "model",
          }),

          generateEmbeddings(response),
        ]);

        await createMemory({
          vector: outputEmbeddings,
          metadata: {
            chat: data.chat,
            user: socket.user._id,
            text: response,
          },
          messageId: aiMsg._id,
        });
      } catch (error) {
        console.error("Error processing ai-msg:", error);
        socket.emit("error", { message: "Internal server error" });
      }
    });
  });
};

module.exports = initailizeSocket;
