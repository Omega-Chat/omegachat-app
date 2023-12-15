
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
		let eValue = 0;
		let randomPrime = 0;
		let primitiveRoot = 0;
		let privKey = 0;

		do {
			randomPrime = this.getRandomPrime(10, 100);
			primitiveRoot = this.getPrimitiveRoot(randomPrime);
	
			privKey = Math.floor(
				Math.random() * (randomPrime - 2) + 1
			)
			
			eValue = (Math.pow(primitiveRoot, privKey)) % randomPrime
			
		} while (Number.isNaN(eValue))
			
		const pubKey: ElGamalPublicKey = {
			p: randomPrime,
			g: primitiveRoot,
			e: eValue

		}

		return {
			publicKey: pubKey,
			privateKey: privKey
		}
	}

	encryptation(plainText: string, pubkey: ElGamalPublicKey): CipherChar[] {
		let bValue = 0;
		let c1 = 0;
		let c2 = 0;
		let cipherChar: CipherChar = {
			c1: 0,
			c2: 0
		}

		const unicodeArray = this.getUnicodeValues(plainText);

		const encrypted: CipherChar[] = []

		for (let i = 0; i < unicodeArray.length; i++) {
			do {
	
				bValue = Math.floor(
					Math.random() * (pubkey.p - 2) + 1
				)
		
				c1 = (Math.pow(pubkey.g, bValue)) % pubkey.p
				c2 = unicodeArray[i] * (Math.pow(pubkey.e, bValue)) % pubkey.p
		
				cipherChar = {
					c1: c1,
					c2: c2
		
				}		
				
			} while (Number.isNaN(cipherChar.c1) || Number.isNaN(cipherChar.c2))

			encrypted.push(cipherChar)
		}

			return encrypted;

	}

	decryptation(cipherText: CipherChar[], keys: ElGamalKeys): string {

		const decrypted = [];

		for (let i = 0; i < cipherText.length; i++) {
			const xValue = Math.pow(cipherText[i].c1, keys.privateKey) % keys.publicKey.p;
			const decryptedChar = cipherText[i].c2 * Math.pow(xValue, (keys.publicKey.p - 2)) % keys.publicKey.p;
			decrypted.push(decryptedChar)
		}

		return String.fromCharCode(...decrypted);

	}	
	  
}