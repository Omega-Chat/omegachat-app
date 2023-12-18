import { Chat } from "../../entities/Chat";
import ChatService from "../../services/ChatService";

export class FindChat {

    constructor(private readonly chatService: ChatService) {
        this.chatService = chatService
    }

    async execute(id_user1: string , id_user2: string): Promise<Chat | null> {

        const createdChat = await this.chatService.create(id_user1, id_user2);

        return createdChat;


    }
}