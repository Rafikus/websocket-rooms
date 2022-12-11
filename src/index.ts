import express from "express";
import * as http from "http";
import * as WebSocket from "ws";

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on("connection", (webSocket: WebSocket) => {
  webSocket.on("message", (message: string) => {
    console.log("Message from client :: " + message);
    webSocket.send("Echo :: " + message);
  });
  webSocket.send("Welcome to chat !!");
});


server.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});
