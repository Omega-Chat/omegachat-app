import { ElGamalPublicKey } from "./Elgamal";

export interface User {
    _id?: string,
    email: string,
    name: string,
    password: string,
    pub_key?: ElGamalPublicKey,
    id_addressee?: string,
    id_group?: string,
    online: boolean
}
