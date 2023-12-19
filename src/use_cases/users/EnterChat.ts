import UserService from "../../services/UserService";
import { User } from "../../entities/User";

export class EnterChat {
    private userService: UserService;

    constructor(userService: UserService) {
       this.userService = userService
    }

    async execute(user_id: string): Promise<User | null> {
    return this.userService.enterChat(user_id, true);
  }
 
}
