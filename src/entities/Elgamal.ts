// ElGamal public key interface
export interface ElGamalPublicKey {
    p: string;
    g: string;
    e: string;
}

export interface ElGamalKeys {
    publicKey: ElGamalPublicKey;
    privateKey: bigint;
}

export interface CipherChar {
    cipher: string
}