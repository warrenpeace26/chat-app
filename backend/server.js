import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { db } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from 'socket.io';

const app = express()
const server = http.createServer(app)

// Initialize socted.io
export const io = new Server(server, {
    cors: {origin: "*"}
})  

// Store online users
export const userSocketMap = {};  // {userID: socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("🔍 Full socket handshake auth:", socket.handshake.auth);

  const userId = socket.handshake.query.userId;  // ✅ Correct way
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit:"4mb"}));
const allowedOrigins = [
  "https://chat-app-one-omega-88.vercel.app",  // your frontend
  "http://localhost:5173" // for local dev (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Routes setup
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);



// connect database
await db();

if(process.env.NODE_ENV !== "production"){
const port = process.env.PORT || 5000
  server.listen(port, ()=>{
    console.log(`server is connected on ${port}`)
} );
}

// Export server for vercel
export default server;