import { ChatGroup } from "../entities/ChatGroup";

export default class ChatGroupService {

    async createGroupChat(userIds: string[], name: string): Promise<ChatGroup> {
        // Método para criar um chat em grupo
        const response = await fetch(`http://localhost:8081/api/chatGroups`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userIds, name }),
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

      async getUsersInGroupChat(chatId: string): Promise<string[] | null> {
        try {
            // Método para obter os usuários de um chat em grupo
            const response = await fetch(`http://localhost:8081/api/chatGroups/${chatId}/users`, {
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
        } catch (error) {
            console.error('Error getting users in group chat:', error);
            return null;
        }
    }

    async getGroupChatByUser(userId: string): Promise<string[] | null> {
      try {
          // Método para obter os groupos de um usuário
          const response = await fetch(`http://localhost:8081/api/chatGroups/${userId}`, {
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
      } catch (error) {
          console.error('Error getting group chat:', error);
          return null;
      }
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

    async  deleteChatGroup(groupId: string): Promise<boolean> {
      const response = await fetch(`http://localhost:8081/api/chatGroups/${groupId}`, {
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