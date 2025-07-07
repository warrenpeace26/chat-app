import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { db } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ Correct CORS for socket.io
export const io = new Server(server, {
  cors: {
    origin: ['https://chat-app-one-omega-88.vercel.app',   "http://localhost:5173" ],
    credentials: true
  }
});

// ✅ Store userSocketMap
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ✅ Apply CORS to Express app
app.use(cors({
  origin: ['https://chat-app-one-omega-88.vercel.app',   "http://localhost:5173" ],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "4mb" }));

// ✅ Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ✅ DB and Start Server
await db();

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ✅ Export server for Vercel
export default server;
