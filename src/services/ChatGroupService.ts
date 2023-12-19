import { ChatGroup } from "../entities/ChatGroup";

export default class ChatGroupService {

    async createGroupChat(): Promise<ChatGroup> {
        // Método para criar um chat em grupo
        const response = await fetch(`http://localhost:3000/api/group-chats`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const responseJSON = await response.json();
        const responseStatus = response.status;
    
        if (responseStatus !== 200) throw new Error(responseJSON.message);
    
        return responseJSON;
      }
    
      async addMessageToGroupChat(chatId: string, message: string): Promise<ChatGroup> {
        // Método para adicionar mensagem a um chat em grupo
        const response = await fetch(`http://localhost:3000/api/group-chats/${chatId}/messages`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message
          })
        });
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
      }
    
      async getMessagesFromGroupChat(chatId: string): Promise<string[][] | null> {
        // Método para obter mensagens de um chat em grupo
        const response = await fetch(`http://localhost:3000/api/group-chats/${chatId}/messages`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const responseJSON = await response.json();
        const responseStatus = response.status;
    
        if (responseStatus !== 200) throw new Error(responseJSON.message);
    
        return responseJSON;
      }

}