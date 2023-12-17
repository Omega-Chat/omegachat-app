import UserService from "../../services/UserService";
import { User } from "../../entities/User";
import { ElGamalPublicKey } from "../../entities/Elgamal";

export class UpdatePubKey {
    private userService: UserService;

    constructor(userService: UserService) {
       this.userService = userService
    }

    async execute(user_id: string, pub_key: ElGamalPublicKey | undefined): Promise<User | null> {
    return this.userService.updatePubKey(user_id, pub_key);
  }
 
}
