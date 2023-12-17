import { ElGamalPublicKey } from "../entities/Elgamal";
import { User } from "../entities/User";

export default class UserService {

    async login(email: string, password: string): Promise<User> {
        const response = await fetch(`http://localhost:3000/api/loginUser`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;

    }

    async fetchAll(): Promise<User[]> {
        const response = await fetch(
          `http://localhost:3000/api/users`
        );
    
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

    async updatePubKey(user_id: string, pub_key: ElGamalPublicKey|undefined): Promise<User> {
        
        const response = await fetch(`http://localhost:3000/api/users/${user_id}/pub_key`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pub_key: pub_key })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }
    
    async exitChat(user_id: string, newState: boolean| undefined): Promise<User> {

        const response = await fetch(`http://localhost:3000/api/users/${user_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ online: newState })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }







}