export interface ChatGroup {
  _id?: string;
  userIds: string[]
    msg_list: string[][];
  }

  export interface Message {
    text: string;
    isUser: boolean;
    senderName: string;
  }