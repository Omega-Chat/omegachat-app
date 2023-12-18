export interface Chat {
    _id?: string,
    id_usuario1?: string;
    id_usuario2?: string;
    msg_list: string[][];
}
  
export interface Message {
    text: string;
    isUser: boolean;
}
  