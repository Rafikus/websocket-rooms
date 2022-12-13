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
  console.log("Connected :: " + socket.client);
  socket.on("join", (data) => joinHandler(data, socket, io));

  socket.on("action", (data) => {
    socket.to(socket.data.roomId).emit("action", data);
  });

  socket.on("mousemove", (coordinates) => {
    socket.to(socket.data.roomId).emit("mousemove", {
      coordinates,
      userId: socket.data.userId,
    });
  });
});

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server started ");
});
