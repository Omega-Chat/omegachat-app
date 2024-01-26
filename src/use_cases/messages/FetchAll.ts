import ChatService from "../../services/ChatService";

export class FetchAllChats {
    private chatService: ChatService;

    constructor(chatService: ChatService) {
       this.chatService = chatService
    }

    async execute() {
        return this.chatService.fetchAll();
      }
 
}
