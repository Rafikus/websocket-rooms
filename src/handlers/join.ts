import { Socket } from "socket.io";
import { v4 } from "uuid";

const states: { [k: string]: any } = {};

export const joinHandler = (data: any, socket: Socket) => {
  const { state, username, roomId } = data;
  const userId = v4();
  socket.data.userId = userId;
  socket.data.username = username;
  try {
    const newRoomId = v4().slice(0, 2);
    if (roomId) {
      socket.join(roomId);
    } else {
      socket.join(newRoomId);
      socket.emit("room_id", newRoomId);
      console.timeStamp(newRoomId);
    }
    states[roomId ?? newRoomId] = state;
    socket.emit("joined", {
      roomID: roomId ?? newRoomId,
      userID: userId,
      state: roomId ? states[roomId] : undefined,
    });
  } catch {
    console.error("Error during JOIN");
  }
};
