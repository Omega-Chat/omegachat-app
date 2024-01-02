import UserService from "../../services/UserService";

export class FindUserById {
    private userService: UserService;

    constructor(userService: UserService) {
       this.userService = userService;
    }

    async execute(userId: string) {
        try {
            return await this.userService.findUserById(userId);
        } catch (error) {
            // Handle errors here or propagate them upwards
            throw new Error(`Error finding user by ID`);
        }
    }
}
