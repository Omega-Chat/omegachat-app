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
			randomPrime = this.getRandomPrime(200, 300);
			primitiveRoot = this.getPrimitiveRoot(randomPrime);
      		// console.log("random prime é: ", randomPrime)
      		// console.log("raiz primitiva é: ", primitiveRoot)

			const randomBytes = new Uint8Array(1); // Adjust the size according to your needs
			
			do {
				privKey = window.crypto.getRandomValues(randomBytes)[0]
			}
			while (1 !== privKey && privKey >= randomPrime - 1)

			privKey = Math.floor(Math.random() * 9) + 1;

			eValue = (primitiveRoot ** privKey) % randomPrime

			privKey = privKey * (randomPrime + primitiveRoot + eValue) * 54321; 
			
		} while (Number.isNaN(eValue))
			
		const pubKey: ElGamalPublicKey = {
			p: String(BigInt(randomPrime * 12345)),
			g: String(BigInt(primitiveRoot * 12345)),
			e: String(BigInt(eValue * 12345))
		}

		return {
			publicKey: pubKey,
			privateKey: privKey
		}
	}

	encryptation(plainText: string, pubkey: ElGamalPublicKey): string {
		let bValue: bigint;
		let c1;
		let c2;
		let cipherChar: CipherChar;

		const unicodeArray = this.getUnicodeValues(plainText);
    	console.log("Unicode é:", unicodeArray)

		let encrypted = "";

		let pubkey_g = BigInt(pubkey.g) / BigInt(12345)
		let pubkey_p = BigInt(pubkey.p) / BigInt(12345)
		let pubkey_e = BigInt(pubkey.e) / BigInt(12345)

		for (let i = 0; i < unicodeArray.length; i++) {
			do {
	
				bValue = BigInt(2)
		
				c1 = Number((pubkey_g ** bValue) % pubkey_p)
				console.log("pubkey g é:", pubkey_g)
				console.log("em c1, publkey p é:", pubkey_p)
				console.log("c1 é:", c1)

				c2 = Number((BigInt(unicodeArray[i]) * (pubkey_e ** bValue)) % pubkey_p)
				console.log("unicodeArray é", unicodeArray)
				console.log("pubkey e é:", pubkey_e)
				console.log("bValue é:", bValue)
				console.log("pubkey p é:", pubkey_p)
				console.log("c2 é:", c2)
				
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

		console.log("O cipher é: ", cipherText)

		let pubkey_g = BigInt(keys.publicKey.g) / BigInt(12345)
		let pubkey_p = BigInt(keys.publicKey.p) / BigInt(12345)
		let pubkey_e = BigInt(keys.publicKey.e) / BigInt(12345)

		let privkey = BigInt(keys.privateKey) / ((pubkey_g + pubkey_p + pubkey_e) * BigInt(54321))
		
		for (let i = 0; i < chipher.length; i++) {
			
			const c1 = Number(chipher[i].split(",")[0]);
			console.log("O c1 no decrypt é", BigInt(c1))
			const c2 = Number(chipher[i].split(",")[1]);
			
     		console.log("a private key é: ", privkey)
			const xValue = (BigInt(c1) ** privkey) % pubkey_p;
			console.log("A privateKey no decrypt é", privkey)
			console.log("o p no decrypt é", pubkey_p)
      		console.log("x é:", xValue)
			const decryptedChar = Number(BigInt(c2) * (xValue ** (pubkey_p - BigInt(2))) % pubkey_p)
      		console.log("decryptedChar:", decryptedChar)
			decrypted.push(decryptedChar)
		}

    	console.log("decrypted é:", decrypted)

		return String.fromCharCode(...decrypted);
  }
	  
}