import ChatService from "../../services/ChatService";

export class DeletePrivateChat {
    private chatService: ChatService;

    constructor(chatService: ChatService) {
       this.chatService = chatService
    }

    async execute(chatId: string): Promise<boolean> {
    return this.chatService.deletePrivateChat(chatId);
  }
 
}
