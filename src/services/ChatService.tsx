import { Chat } from "../entities/Chat";


export default class ChatService {

    async create(id_usuario1: string, id_usuario2: string): Promise<Chat> {
        const response = await fetch(`http://localhost:3000/api/chats`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario1: id_usuario1,
                id_usuario2: id_usuario2
            })
        })
        const responseJSON = await response.json();
        const responseStatus = response.status;
        if (responseStatus !== 200) throw new Error(responseJSON.message);
        return responseJSON;
    }

}