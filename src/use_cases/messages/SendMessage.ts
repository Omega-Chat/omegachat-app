import { Chat } from "../../entities/Chat";
import ChatService from "../../services/ChatService";

export class SendMessage {

    constructor(private readonly chatService: ChatService) {
        this.chatService = chatService
    }

    async execute(chatId: string | undefined, message: string, sender: string): Promise<Chat | null> {

        const sendedMessage = await this.chatService.sendMessage(chatId, message, sender);

        return sendedMessage;


    }
}