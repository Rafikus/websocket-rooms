import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { Message, MessageType } from "./types";
import { joinHandler } from "./handlers/join";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
let host: Socket | null = null;
let currentStore = "";

io.on("connection", (socket) => {
  console.timeStamp("Connected :: " + socket.client);
  socket.on("join", (data) => joinHandler(data, socket));

  socket.on("action", (data) => {
    socket.to(socket.data.roomId).emit("action", data);
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
