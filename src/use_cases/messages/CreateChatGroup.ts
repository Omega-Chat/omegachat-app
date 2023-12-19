import { ChatGroup } from "../../entities/ChatGroup";
import ChatGroupService from "../../services/ChatGroupService";

export class CreateChatGroup {
  constructor(private readonly chatGroupService: ChatGroupService) {}

  async execute(): Promise<ChatGroup | null> {
 
      const newChatGroup = await this.chatGroupService.createGroupChat();
      return newChatGroup;
  }
}
