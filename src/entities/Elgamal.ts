// ElGamal public key interface
interface ElGamalPublicKey {
    p: number;
    g: number;
    e: number;
}

interface ElGamalKeys {
    publicKey: ElGamalPublicKey;
    privateKey: number;
}

interface CipherChar {
    c1: number,
    c2: number
}
