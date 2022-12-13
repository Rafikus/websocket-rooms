import express from "express";
import * as http from "http";
import { Server, WebSocket } from "ws";

const app = express();
const server = http.createServer(app);
const webSocketServer = new Server({ server });
let host: WebSocket | null = null;
let currentStore = "";

webSocketServer.on("connection", (webSocket) => {
  if (!host) {
    host = webSocket;
    webSocket.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "store_update") {
          currentStore = JSON.stringify(msg.data);
        }
      } catch {
        console.log("err");
      }
    });
  }

  webSocket.on("message", (data) => {
    try {
      console.log("Message from client :: " + data);
      const type = JSON.parse(data.toString()).type;
      const str = data.toString();
      if (type !== "store_update") {
        webSocketServer.clients.forEach((client) => {
          if (client !== webSocket) {
            client.send(str);
          }
        });
      }
    } catch {
      console.log("err");
    }
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});
