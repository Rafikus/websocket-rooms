import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { Message, MessageType } from "./types";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let host: Socket | null = null;
let currentStore = "";

io.on("connection", (socket) => {
  if (!host) {
    host = socket;
    socket.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString()) as Message;
        if (msg.type === MessageType.STORE_UPDATE) {
          currentStore = JSON.stringify(msg.data);
        }
      } catch {
        console.log("err");
      }
    });
  }

  socket.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString()) as Message;
      console.log("Message from client :: " + data);
      const type = message.type;
      if (type !== MessageType.STORE_UPDATE) {
        socket.broadcast.emit(data);
      }
    } catch {
      console.log("err");
    }
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});
