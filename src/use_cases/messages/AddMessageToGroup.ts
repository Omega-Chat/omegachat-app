import { ChatGroup } from "../../entities/ChatGroup";
import ChatGroupService from "../../services/ChatGroupService";

export class AddMessageToGroupChat {
  constructor(private readonly chatGroupService: ChatGroupService) {}

  async execute(groupId: string, message: string, sender: string): Promise<ChatGroup | null> {
    
      const updatedGroup = await this.chatGroupService.addMessageToGroupChat(groupId, message, sender);
      return updatedGroup;
  }
}
