export enum MessageType {
  STORE_UPDATE = "store_update",
  ACTION = "action",
}

export interface Message {
  type: MessageType;
  data: any;
}
