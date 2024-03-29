import { ElGamalPublicKey } from "../entities/Elgamal";
import { User } from "../entities/User";
import { API_URL } from "../constants";

export default class UserService {

    async createUser(name: string, email: string, password: string): Promise<User> {
        try {
          const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                online: false
            
            })
          });
      
          const responseJSON = await response.json();
          const responseStatus = response.status;
      
          if (responseStatus !== 201) {
            throw new Error(responseJSON.message || 'Error creating a new user');
          }
      
          return responseJSON;
        } catch (error) {
          throw new Error('Error creating a new user');
        }
      }
      

    async login(email: string): Promise<User> {
        const response = await fetch(`${API_URL}/loginUser`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;

    }

    async fetchAll(): Promise<User[]> {
        const response = await fetch(
          `${API_URL}/users`
        );
    
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

    async updatePubKey(user_id: string, pub_key: ElGamalPublicKey|undefined): Promise<User> {
        
        const response = await fetch(`${API_URL}/users/${user_id}/pub_key`, {
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

        const response = await fetch(`${API_URL}/users/${user_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newState: newState })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

    async enterChat(user_id: string, newState: boolean| undefined): Promise<User> {

        const response = await fetch(`${API_URL}/users/${user_id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newState: newState })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

    async findUserById(userId: string): Promise<User> {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

}