import UserService from "../../services/UserService";
import { User } from "../../entities/User";

export default class CreateUser {
    private userService: UserService;
  
    constructor(userService: UserService) {
      this.userService = userService;
    }
  
    async execute(name: string, email: string, password: string): Promise<User | null> {

      // Validar os campos do usuário
      if (!this.isValidField(name)) throw new Error("Preencha o campo de nome.");
      if (!this.isValidField(email)) throw new Error("Preencha o campo de email.");
      if (!this.isValidField(password)) throw new Error("Preencha o campo de senha.");
  
      // Criar o novo usuário
      const createdUser = await this.userService.createUser(name, email, password);
  
      return createdUser;
    }
  
    private isValidField(field: string): boolean {
      return field !== "";
    }
  }
  