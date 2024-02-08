// import { useNavigate } from "react-router-dom";
// import {useEffect, useState} from "react";
import { leaveChat} from "../theme/colors";
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
import { EnterChat } from "../use_cases/users/EnterChat";
import ChatGroupService from "../services/ChatGroupService";
import { CreateChatGroup } from "../use_cases/messages/CreateChatGroup";
import { FindChat } from "../use_cases/messages/FindChat";
import { isStringObject } from "util/types";
import Popup from './PopUpScreen';

const crypto = new ElgamalService();
const fetchall = new FetchAll(new UserService())
const updatepubkey = new UpdatePubKey(new UserService())
const exitchat = new ExitChat(new UserService())
const enterChat = new EnterChat(new UserService())
const deleteChat = new DeletePrivateChat(new ChatService())
const createGroupChat = new CreateChatGroup(new ChatGroupService())
const findChat = new FindChat(new ChatService());


export default function HomeChatScreen() {

	const location = useLocation();
	const navigate = useNavigate();

	const [onlineUserList, setOnlineUserList] = useState<User[]>();
	const [allOnlineUsers, setAllOnlineUsers] = useState<User[]>([]);
	const [notifications, setNotification] = useState<number[]>()
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	

	useEffect(() => {
		const interval = setInterval(() => {
			fetchall.execute().then((data) => {
				setAllOnlineUsers(data);
				let filteredUsers = RemoveUserByName(data, location.state.sender.name);
				setOnlineUserList(filteredUsers);
			})
	
			const chatId = sessionStorage.getItem('ChatId');
			if(chatId) {
				deleteChat.execute(chatId);
				sessionStorage.removeItem('ChatId');
			}
	
			enterChat.execute(location.state.sender._id);
	
			getNotifications();

		  }, 2000);
	  
		  return () => clearInterval(interval);


	});

	const openPopup = () => {
		setIsPopupOpen(true);
	  };

	async function getNotifications() {

		if(onlineUserList){
			const users: User[] = onlineUserList;
			const tempArray: number[] = [];

			for(let i = 0; i < users.length; i++) {

					let user_id = String(users[i]._id);
					console.log(location.state.sender, user_id)
					const chat = await findChat.execute(location.state.sender._id, user_id)
					if(chat){
						tempArray.push(chat.msg_list.length)
					} else {
						tempArray.push(0)
					}
			}
			setNotification(tempArray)
		}

	}

	function executeOnce() {

		sessionStorage.removeItem('hasExecutedChat');
		sessionStorage.removeItem('senderMessages');
		sessionStorage.removeItem('publicKey');

		const hasExecuted = sessionStorage.getItem('hasExecuted');
	
		if (hasExecuted == 'false' || !hasExecuted) {
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

			keys = crypto.generateKeyPair();

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
		const currentUserID = location.state.sender._id;
		const userIds = [...allOnlineUsers.map(user => user._id), currentUserID];
		navigate('/group', {
			state: { sender: location.state.sender, user_ids: userIds},
		  })
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
				  notification={notifications !== undefined ? notifications[index]: 0}
				  onChatStart={() =>
					navigate('/private', {
					  state: { sender: location.state.sender, recipient: user},
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
			  onClick={openPopup}
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

		  <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
		</div>
	  );
	}