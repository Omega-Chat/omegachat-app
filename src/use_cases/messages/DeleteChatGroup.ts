import ChatGroupService from "../../services/ChatGroupService";

export class DeleteChatGroup {
    private chatGroupService: ChatGroupService;

    constructor(chatGroupService: ChatGroupService) {
        this.chatGroupService = chatGroupService;
    }

    async execute(groupId: string): Promise<boolean> {
        try {
            // Chama o método do serviço para deletar o grupo de chat
            const isDeleted = await this.chatGroupService.deleteChatGroup(groupId);
            return isDeleted;
        } catch (error) {
            console.error('Error deleting group chat:', error);
            return false;
        }
    }
}
