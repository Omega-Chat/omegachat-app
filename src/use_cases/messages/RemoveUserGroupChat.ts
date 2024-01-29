import ChatGroupService from "../../services/ChatGroupService";

export class RemoveUserGroupChat {
    private chatGroupService: ChatGroupService;

    constructor(chatGroupService: ChatGroupService) {
        this.chatGroupService = chatGroupService
    }

    async execute(groupId: string, userId: string): Promise<boolean> {
        return this.chatGroupService.removeUser(groupId, userId)
    }
}