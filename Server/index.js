import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {
  UserRouter,
  AuthenticationRouter,
  GenreRouter,
  SongRouter,
  ArtistRouter,
  AlbumRouter,
  PlaylistRouter,
  VnPayRouter,
  NotificationRouter,
  CommentRouter,
  TransactionRouter,
  ReportQuestionRouter,
  EventRouter,
  ArtistKitApplicationRouter,
} from "./routes/index.js";
import "./utils/google-oauth2.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { eventScheduler } from "./utils/scheduler.js";
import http from "http";
const app = express();
const server = http.createServer(app);
dotenv.config();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "PUT, POST, GET, DELETE, OPTIONS, PATCH",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Define endpoint to fetch playlists
app.get("/api/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.find(); // Retrieve all playlists from the database
    res.json(playlists); // Send the playlists as a JSON response
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  "/upload/image",
  express.static(path.join(__dirname, "upload", "image"))
);

app.get("/hello", (req, res) => {
  return res.status(200).json("hello");
});

app.use("/api/auth", AuthenticationRouter);
app.use("/api/album", AlbumRouter);
app.use("/api/songs", SongRouter);
app.use("/api/genres", GenreRouter);
app.use("/api/artists", ArtistRouter);
app.use("/api/user", UserRouter);
app.use("/api/playlist", PlaylistRouter);
app.use("/api/notification", NotificationRouter);
app.use("/api/payment", VnPayRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/reportquestion", ReportQuestionRouter);
app.use(
  "/upload/image",
  express.static(path.join(__dirname, `upload`, "image"))
);
app.use("/api/artists", ArtistRouter);
app.use("/api/comments", CommentRouter);
app.use("/api/event", EventRouter);
app.use("/api/artistKitApplication", ArtistKitApplicationRouter);

const port = process.env.PORT || 9999;
const MONGODB_URI = process.env.MONGODB_URI;
eventScheduler();
const io = new Server(server, {
  cors: corsOptions,
});
io.on("connection", (socket) => {
  console.log("A user just connected", socket.id);
  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket?.userId);
  });
});
server.listen(port, async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
  }
  console.log(`Server running on http://localhost:${port}`);
});
export { io };
