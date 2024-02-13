import ChatGroupService from "../../services/ChatGroupService";

export class GetGroupChatMessages {
  constructor(private readonly chatGroupService: ChatGroupService) {}

  async execute(groupId: string): Promise<string[][] | null> {
    
      const messages = await this.chatGroupService.getMessagesFromGroupChat(groupId);
      return messages;
  }
}
