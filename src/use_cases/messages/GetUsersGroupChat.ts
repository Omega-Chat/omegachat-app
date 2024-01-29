import ChatGroupService from "../../services/ChatGroupService";

export class GetUsersGroupChat {
    private chatGroupService: ChatGroupService;

    constructor(chatGroupService: ChatGroupService) {
        this.chatGroupService = chatGroupService
    }

    async execute(groupId: string): Promise<string[] | null> {
        try {
            // Chama o método do serviço para obter os usuários do grupo de chat
            const users = await this.chatGroupService.getUsersInGroupChat(groupId);
            return users;
        } catch (error) {
            console.error('Error getting users in group chat:', error);
            return null;
        }
    }
}
