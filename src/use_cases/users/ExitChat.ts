import UserService from "../../services/UserService";
import { User } from "../../entities/User";

export class ExitChat {
    private userService: UserService;

    constructor(userService: UserService) {
       this.userService = userService
    }

    async execute(user_id: string): Promise<User | null> {
    return this.userService.exitChat(user_id, false);
  }
 
}
