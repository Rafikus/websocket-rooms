import { Socket } from "socket.io";
import { v4 } from "uuid";

const states: { [k: string]: any } = {};

export const joinHandler = async (data: any, socket: Socket, io: any) => {
  const { state, username } = data;
  const roomId = "abc";
  socket.data.username = username;
  socket.data.userId = socket.id;

  try {
    const newRoomId = socket.id.slice(0, 4);
    if (roomId) {
      // && (await io.in(roomId).fetchSockets()).length > 0) {
      socket.join(roomId);
    } else {
      socket.join(newRoomId);
      socket.emit("room_id", newRoomId);
    }
    const room = roomId ?? newRoomId;
    states[room] = state;

    socket.data.roomId = room;
    socket.emit("joined", {
      roomId: room,
      userId: socket.data.userId,
      state: roomId ? states[roomId] : undefined,
    });
    console.log(
      `\x1b[${31 + (room.charCodeAt(0) % 7)}m%s\x1b[0m`,
      `${username} (${socket.id}) joined room ${room}`
    );
  } catch {
    console.error("Error during JOIN");
  }
};
