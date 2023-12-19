import { Chat } from "../../entities/Chat";
import ChatService from "../../services/ChatService";

export class AddMessageToChat {

    constructor(private readonly chatService: ChatService) {
        this.chatService = chatService;
    }

    async execute(chatId: string, message: string): Promise<Chat | null> {
        const updatedChat = await this.chatService.addMessageToChat(chatId, message);

        return updatedChat;
    }
}
