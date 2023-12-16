// import { useNavigate } from "react-router-dom";
// import {useEffect, useState} from "react";
import { primary } from "../theme/colors";
import { User } from "../entities/User";
import UserChatCard from "../components/userChatCard";
import ElgamalService from "../services/ElgamalService";

const crypto = new ElgamalService();


export default function HomeChatScreen() {

	// const navigate = useNavigate();
	// const [userList, setUserList] = useState<User[]>();
	const users: User[] = [
		{"name": "Arthur", "password": 1234, "online": true},
		{"name": "Guilherme", "password": 1234, "online": true},
		{"name": "Lídia", "password": 1234, "online": false}
	]

	function CryptoTest() {
		// Example usage:
		const msg = "Hello, World!";
		const keys = crypto.generateKeyPair();

		const cipherText = crypto.encryptation(msg, keys.publicKey)

		console.log(cipherText);

		const decipherText = crypto.decryptation(cipherText, keys);

		console.log(decipherText);

	}

	return (
		<div className="container">
            <h1 
				style={{
					textAlign: "left",
					font: "icon",
					fontSize: 40,
					color: primary}}>Chat</h1>
			<div>
				<h3 
					style={{
						textAlign: "left",
						font: "icon",
						marginTop: "5%",
						marginLeft: "5%",
						fontSize: 20,
						fontWeight: "bold",
						color: primary}}>Online Users</h3>
				<hr style={{
					height: 1,
					backgroundColor: "black" 
				}}/>
				<div className="itens-list">
					{users?.map((doc, index) =>
						<UserChatCard 
							data={doc}
							key={index}
							/>
						)	
					}
				</div>
				<button
					style={{
						marginRight: "5%",
						marginLeft: "6%",
						marginTop: "100%",
						height: 50,
						width: 352,
						backgroundColor: primary,
						color: "white",
						borderRadius: 5,
						fontSize: 15

					}}
					onClick={CryptoTest}>Test</button>
			</div>
		</div>
	)
}
