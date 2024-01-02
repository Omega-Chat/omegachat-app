// ElGamal public key interface
export interface ElGamalPublicKey {
    p: string;
    g: string;
    e: string;
}

export interface ElGamalKeys {
    publicKey: ElGamalPublicKey;
    privateKey: number;
}

export interface CipherChar {
    cipher: string
}
