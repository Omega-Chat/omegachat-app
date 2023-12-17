import UserService from "../../services/UserService";

export class FetchAll {
    private userService: UserService;

    constructor(userService: UserService) {
       this.userService = userService
    }

    async execute() {
        return this.userService.fetchAll();
      }
 
}
