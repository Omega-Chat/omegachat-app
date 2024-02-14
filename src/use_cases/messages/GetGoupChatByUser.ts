import ChatGroupService from "../../services/ChatGroupService";

export class GetGroupChatByUser {
    private chatGroupService: ChatGroupService;

    constructor(chatGroupService: ChatGroupService) {
        this.chatGroupService = chatGroupService
    }

    async execute(userId: string): Promise<string[] | null> {
        try {
            // Chama o método do serviço para obter os usuários do grupo de chat
            const groups = await this.chatGroupService.getGroupChatByUser(userId);
            return groups;
        } catch (error) {
            console.error('Error getting group chat:', error);
            return null;
        }
    }
}
