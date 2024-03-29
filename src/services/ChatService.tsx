import { Chat } from "../entities/Chat";
import { API_URL } from "../constants";

export default class ChatService {

    async create(id_usuario1: string, id_usuario2: string): Promise<Chat | null> {
        const response = await fetch(`${API_URL}/chats`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario1: id_usuario1,
                id_usuario2: id_usuario2
            })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

    async findByUsers(id_usuario1: string, id_usuario2: string): Promise<Chat | null> {
        const response = await fetch(`${API_URL}/chats/${id_usuario1}/${id_usuario2}`);
          const responseJSON = await response.json();
          const responseStatus = response.status;
          if (responseStatus !== 200) throw new Error(responseJSON.message);
          return responseJSON;
    }

    async fetchAll(): Promise<Chat[]> {
        const response = await fetch(
          `${API_URL}/chats`
        );
    
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

    async sendMessage(chatId: string | undefined, message: string, sender: string): Promise<Chat | null> {
        console.log(chatId, message, sender)
        const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                sender: sender
            })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

    async deletePrivateChat(chatId: string): Promise<boolean> {
        const response = await fetch(`${API_URL}/chats/${chatId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const responseStatus = response.status;
        if (responseStatus !== 200) {
            const responseJSON = await response.json();
            throw new Error(responseJSON.message);
        }
        return true;
    }

}