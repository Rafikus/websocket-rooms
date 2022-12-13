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

  if (!host) {
    host = socket;
    socket.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString()) as Message;
        if (msg.type === MessageType.STORE_UPDATE) {
          currentStore = msg.data;
        }
      } catch {
        console.log("err");
      }
    });
  }

  socket.on("message", (data) => {
    console.timeStamp("Message from client :: " + data);
    try {
      const message = JSON.parse(data.toString()) as Message;
      const type = message.type;
      if (type !== MessageType.STORE_UPDATE) {
        socket.broadcast.emit(data);
      }
    } catch {
      console.log("err");
    }
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
