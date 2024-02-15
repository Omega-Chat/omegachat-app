import UserService from "../../services/UserService";
import { User } from "../../entities/User";
import bcrypt from 'bcryptjs';

export default class Login {
   private userService: UserService;

   constructor(userService: UserService) {
      this.userService = userService
   }

   async execute(email: string, password: string): Promise<User | null> {

      if (!this.isValidField(email)) throw new Error("Preencha o campo de email.");
      if (!this.isValidField(password)) throw new Error("Preencha o campo de senha.");
      if (!this.isValidEmail(email)) throw new Error("Preencha um email válido.")

      const loggeduser = await this.userService.login(email);

      const isMatch = await new Promise((resolve, reject) => {
         bcrypt.compare(password, loggeduser?.password, function (err, result) {
             if (err) {
                 reject(err);
             } else {
                 resolve(result);
             }
         });
     });

     if (!isMatch) {
         throw new Error("Email ou senha inválidos");
     }

     console.log("Login: ", loggeduser);
     return loggeduser;

   }


   private isValidField(field: string): boolean {
      return field !== ""
   }

   private isValidEmail = (email: string) => {
      const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailValidation.test(email) || email.length === 0) {
         return true;
      }
      return false;
   }

}