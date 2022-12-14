import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import { joinHandler } from "./handlers/join";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join", (data) => joinHandler(data, socket, io));

  socket.on("action", (data) => {
    socket.to(socket.data.roomId).emit("action", data);
  });

  socket.on("mousemove", (coordinates) => {
    socket.to(socket.data.roomId).emit("mousemove", {
      coordinates,
      userId: socket.data.userId,
      username: socket.data.username,
    });
  });
});

io.of("/").adapter.on("create-room", (room) => {
  console.log(
    `\x1b[${31 + (room.charCodeAt(0) % 7)}m%s\x1b[0m`,
    `Room ${room} was created`
  );
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server started ");
});
