export enum MessageType {
  STORE_UPDATE = "store_update",
  ACTION = "action",
  JOIN = "join",
  ROOM_ID = "room_id",
}

export interface Message {
  type: MessageType;
  data: any;
}
