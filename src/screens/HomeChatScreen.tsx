// import { useNavigate } from "react-router-dom";
// import {useEffect, useState} from "react";
import { leaveChat, primary } from "../theme/colors";
import { User } from "../entities/User";
import UserChatCard from "../components/userChatCard";
import ElgamalService from "../services/ElgamalService";
import { useEffect, useState } from "react";
import { ElGamalKeys } from "../entities/Elgamal";
import {useLocation, useNavigate} from 'react-router-dom';
import { FetchAll } from "../use_cases/users/FetchAll";
import UserService from "../services/UserService";
import { UpdatePubKey } from "../use_cases/users/UpdatePubKey";
import { ExitChat } from "../use_cases/users/ExitChat";
import { DeletePrivateChat } from "../use_cases/messages/DeletePrivateChat";
import ChatService from "../services/ChatService";



const crypto = new ElgamalService();
const fetchall = new FetchAll(new UserService())
const updatepubkey = new UpdatePubKey(new UserService())
const exitchat = new ExitChat(new UserService())
const deleteChat = new DeletePrivateChat(new ChatService())


export default function HomeChatScreen() {

	const location = useLocation();
	const [privateKey, setPrivateKey] = useState<String>()
	const navigate = useNavigate();

	const [onlineUserList, setOnlineUserList] = useState<User[]>();

	useEffect(() => {
		fetchall.execute().then((data) => {
			let filteredUsers = RemoveUserByName(data, location.state.sender.name);
			setOnlineUserList(filteredUsers);
		})

		const chatId = sessionStorage.getItem('ChatId');
		if(chatId) {
			deleteChat.execute(chatId);
			sessionStorage.removeItem('ChatId');
		}
		


	}, []);

	function executeOnce() {

		const hasExecuted = sessionStorage.getItem('hasExecuted');
	
		if (!hasExecuted) {
			let keys = CryptographyTest();
			console.log("Keys Generated:", keys)
			updatepubkey.execute(location.state.sender._id, keys?.publicKey);
			
			sessionStorage.setItem('privateKey', String(keys?.privateKey));

			sessionStorage.setItem('hasExecuted', "true");
		}
	}

	executeOnce();



	function RemoveUserByName(usersArray: User[], userName: string) {
		// Find the index of the user with the specified name
		const indexToRemove = usersArray.findIndex(user => user.name === userName);
	
		// If the user with the specified name is found, remove it from the array
		if (indexToRemove !== -1) {
			usersArray.splice(indexToRemove, 1);
		}
	
		// Return the modified array
		return usersArray;
	}

	function CryptographyTest() {
		try {
			
			// Example usage:
			const test_msg = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
			let keys: ElGamalKeys;
			let decipherText;
			let cipherText;

			do {

				keys = crypto.generateKeyPair();
	
				cipherText = crypto.encryptation(test_msg, keys.publicKey)
				
				decipherText = crypto.decryptation(cipherText, keys);
				
			} while (test_msg !== decipherText);
			
			return keys;
	

		} catch (error: any) {
			console.log(error)
		}
	}

	async function LeaveChat() {
		try {
			const exitedUser = await exitchat.execute(location.state.sender._id);
			console.log(exitedUser)

			navigate("/");

		} catch (error: any) {
			console.log(error)
		}
	}

	async function ToGroup() {
		navigate("/group");
	}

	return (
		<div className="container">
		  <div>
			<h1
			  style={{
				textAlign: 'left',
				font: 'icon',
				fontSize: 40,
				color: 'primary',
			  }}
			>
			  Chat
			</h1>
			<h3
			  style={{
				textAlign: 'left',
				font: 'icon',
				marginTop: '5%',
				marginLeft: '5%',
				fontSize: 20,
				fontWeight: 'bold',
				color: 'primary',
			  }}
			>
			  Online Users
			</h3>
			<hr style={{ height: 1, backgroundColor: 'black' }} />
			<div className="itens-list">
			  {onlineUserList?.map((user, index) => (
				<UserChatCard
				  key={index}
				  data={user}
				  onChatStart={() =>
					navigate('/private', {
					  state: { sender: location.state.sender, recipient: user, privateKey: privateKey },
					})
				  }
				/>
			  ))}
			</div>
			
			<img
			  src="src\screens\img\Vector.png" // Replace with your image path
			  alt="Image Alt Text"
			  style={{
				width: '100px', // Adjust the width as needed
				height: 'auto', // Maintain aspect ratio
				display: 'block',
				margin: '270px auto 0px auto', // Updated margin for positioning
				marginLeft: 260,
			  }}
			  onClick={ToGroup}
			/>
			<p
			  style={{
				textAlign: 'center',
				fontSize: 16,
				color: 'gray',
				marginLeft: 230,
			  }}
			>
			  Chat em grupo
			</p>
			<button
			  style={{
				marginTop: '20px', // Position the button at the bottom of the page
				height: 50,
				width: 352,
				backgroundColor: leaveChat,
				color: 'black',
				fontWeight: 'bold',
				borderRadius: 5,
				fontSize: 20,
				display: 'block',
				margin: '40px auto 5%', // Center the button with margin
			  }}
			  onClick={LeaveChat}
			>
			  Leave Chat
			</button>
		  </div>
		</div>
	  );
	}