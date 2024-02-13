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
      if (!this.isValidPassword(password)) throw new Error("A senha deve possuir entre 8 e 20 caracteres, contendo números e letras maiúscula e minusculas.")
      if (!this.isValidField(password)) throw new Error("Preencha o campo de senha.");
      if (!this.isValidEmail(email)) throw new Error("Insira um email válido.");
  
      // Criar o novo usuário
      const createdUser = await this.userService.createUser(name, email, password);
  
      return createdUser;
    }

    private isValidPassword(password: string) {
      const passwordValidation = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/
      return passwordValidation.test(password)
    }
  
    private isValidField(field: string): boolean {
      return field !== "";
    }

    private isValidEmail = (email: string) => {
      const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailValidation.test(email) || email.length === 0) {
         return true;
      }
      return false;
   }
  }
  