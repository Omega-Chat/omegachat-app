import { ChatGroup } from "../entities/ChatGroup";

export default class ChatGroupService {

    async createGroupChat(userIds: string[]): Promise<ChatGroup> {
        // Método para criar um chat em grupo
        const response = await fetch(`http://localhost:8081/api/chatGroups`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userIds }),
        });
        const responseJSON = await response.json();
        const responseStatus = response.status;
    
        if (responseStatus !== 201) throw new Error(responseJSON.message);
    
        return responseJSON;
      }
    
      async addMessageToGroupChat(chatId: string, message: string, sender: string, receiver: string ): Promise<ChatGroup> {
        console.log("Group ID: ", chatId)
        // Método para adicionar mensagem a um chat em grupo
        const response = await fetch(`http://localhost:8081/api/chatGroups/${chatId}/messages`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            sender: sender,
            receiver: receiver
          })
        });
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
      }
    
      async getMessagesFromGroupChat(chatId: string): Promise<string[][] | null> {
        // Método para obter mensagens de um chat em grupo
        const response = await fetch(`http://localhost:8081/api/chatGroups/${chatId}/messages`, {
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

      async removeUser(groupId: string, userId: string): Promise<boolean> {
        const response = await fetch(`http://localhost:8081/api/chatGroups/${groupId}/${userId}`, {
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