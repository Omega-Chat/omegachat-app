import { ElGamalPublicKey } from "../entities/Elgamal";
import { ElGamalKeys } from "../entities/Elgamal";
import { CipherChar } from "../entities/Elgamal";

export default class ElgamalService {

	isPrime(num: number) {
		if (num <= 1) return false;
		if (num <= 3) return true;
		
		if (num % 2 === 0 || num % 3 === 0) return false;
	  
		for (let i = 5; i * i <= num; i += 6) {
		  if (num % i === 0 || num % (i + 2) === 0) return false;
		}
	  
		return true;
	  }
	  
	  getRandomPrime(min: number, max: number) {
		if (min >= max || min < 0) {
		  throw new Error('Invalid input: make sure min is less than max, and both are positive.');
		}
	  
		let randomNum;
		do {
		  randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
		} while (!this.isPrime(randomNum));
	  
		return randomNum;
	  }

	isPrimitiveRoot(g: number, p: number): boolean {
		const set = new Set<number>();
		let result = 1;
	  
		for (let i = 1; i < p; i++) {
		  result = (result * g) % p;
		  set.add(result);
	  
		  if (set.size === p - 1) {
			return true;
		  }
		}
	  
		return false;
	  }
	  
	getPrimitiveRoot(p: number): number {
		for (let g = 2; g < p; g++) {
		  if (this.isPrimitiveRoot(g, p)) {
			return g;
		  }
		}
	  
		throw new Error(`Primitive root not found for ${p}.`);
	}

	getUnicodeValues(inputString: string): number[] {
		const unicodeValues: number[] = [];
	  
		for (let i = 0; i < inputString.length; i++) {
		  const charCode = inputString.charCodeAt(i);
		  unicodeValues.push(charCode);
		}
	  
		return unicodeValues;
	}

	generateKeyPair(): ElGamalKeys {
		let eValue: number;
		let randomPrime: number;
		let primitiveRoot: number;
		let privKey: number;

		do {
			randomPrime = this.getRandomPrime(100, 500);
			primitiveRoot = this.getPrimitiveRoot(randomPrime);

			const randomBytes = new Uint8Array(1); // Adjust the size according to your needs
			
			do {
				privKey = window.crypto.getRandomValues(randomBytes)[0]
			}
			while (1 !== privKey && privKey >= randomPrime - 1)

			privKey = this.getRandomPrime(1, randomPrime - 2);
			
			eValue = (primitiveRoot ** privKey) % randomPrime
			
		} while (Number.isNaN(eValue))
			
		const pubKey: ElGamalPublicKey = {
			p: String(BigInt(randomPrime)),
			g: String(BigInt(primitiveRoot)),
			e: String(BigInt(eValue))

		}

		return {
			publicKey: pubKey,
			privateKey: BigInt(privKey)
		}
	}

	encryptation(plainText: string, pubkey: ElGamalPublicKey): string {
		let bValue: bigint;
		let c1;
		let c2;
		let cipherChar: CipherChar;

		const unicodeArray = this.getUnicodeValues(plainText);

		let encrypted = "";

		for (let i = 0; i < unicodeArray.length; i++) {
			do {

				const randomBytes = new Uint8Array(1); // Adjust the size according to your needs
	
				bValue = BigInt(window.crypto.getRandomValues(randomBytes)[0])
		
				c1 = Number((BigInt(pubkey.g) ** bValue) % BigInt(pubkey.p))


				c2 = Number(BigInt(unicodeArray[i]) * (BigInt(pubkey.e) ** bValue) % BigInt(pubkey.p))
		
				cipherChar = {cipher: c1 + "," + c2}	
				
			} while (Number.isNaN(cipherChar.cipher.charAt(0)) || Number.isNaN(cipherChar.cipher.charAt(2)))
			
			encrypted = encrypted + cipherChar.cipher + ";";
		}
		return encrypted;
		
	}
	
	decryptation(cipherText: string, keys: ElGamalKeys): string {
		
		const decrypted = [];
		const chipher = cipherText.split(";");
		chipher.pop()
		
		for (let i = 0; i < chipher.length; i++) {
			
			const c1 = Number(chipher[i].split(",")[0]);
			const c2 = Number(chipher[i].split(",")[1]);
			
			const xValue = (BigInt(c1) ** keys.privateKey) % BigInt(keys.publicKey.p);
			const decryptedChar = Number(BigInt(c2) * (xValue ** (BigInt(keys.publicKey.p) - BigInt(2))) % BigInt(keys.publicKey.p))
			decrypted.push(decryptedChar)
		}

		return String.fromCharCode(...decrypted);

	}	
	  
}