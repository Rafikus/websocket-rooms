import { Socket } from "socket.io";
import { v4 } from "uuid";

const states: { [k: string]: any } = {};

export const joinHandler = async (data: any, socket: Socket, io: any) => {
  const { state, username, roomId } = data;
  const userId = v4();
  socket.data.userId = userId;
  socket.data.username = username;
  try {
    const newRoomId = v4().slice(0, 4);
    if (roomId && (await io.in(roomId).fetchSockets()).length > 0) {
      socket.join(roomId);
    } else {
      socket.join(newRoomId);
      socket.emit("room_id", newRoomId);
    }
    states[roomId ?? newRoomId] = state;

    socket.data.roomId = roomId ?? newRoomId;
    socket.emit("joined", {
      roomID: roomId ?? newRoomId,
      userID: userId,
      state: roomId ? states[roomId] : undefined,
    });
  } catch {
    console.error("Error during JOIN");
  }
};
