// ElGamal public key interface
interface ElGamalPublicKey {
    p: bigint;
    g: bigint;
    e: bigint;
}

interface ElGamalKeys {
    publicKey: ElGamalPublicKey;
    privateKey: bigint;
}

interface CipherChar {
    c1: number,
    c2: number
}
