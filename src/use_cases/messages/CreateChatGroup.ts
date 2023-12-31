import { ChatGroup } from "../../entities/ChatGroup";
import ChatGroupService from "../../services/ChatGroupService";

export class CreateChatGroup {
  constructor(private readonly chatGroupService: ChatGroupService) {}

  async execute(userIds: string[]): Promise<ChatGroup | null> {
    console.log("Creating chat group.")
    try {
      const newChatGroup = await this.chatGroupService.createGroupChat(userIds);
      console.log("Chat group sucessfully created.")
      return newChatGroup;
    } catch (error) {
      console.error('Error while creating chat group:', error);
      return null;
    }
  }
}
