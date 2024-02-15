// import { useNavigate } from "react-router-dom";
// import {useEffect, useState} from "react";
import { leaveChat, userCardBackground} from "../theme/colors";
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
import { FindChat } from "../use_cases/messages/FindChat";
import Popup from './PopUpScreen';
import { GetGroupChatByUser } from "../use_cases/messages/GetGoupChatByUser";
import ChatGroupService from "../services/ChatGroupService";

const crypto = new ElgamalService();
const fetchall = new FetchAll(new UserService())
const updatepubkey = new UpdatePubKey(new UserService())
const exitchat = new ExitChat(new UserService())
const enterChat = new EnterChat(new UserService())
const deleteChat = new DeletePrivateChat(new ChatService())
const findChat = new FindChat(new ChatService());
const getChatGroup = new GetGroupChatByUser(new ChatGroupService())

export default function HomeChatScreen() {

	const location = useLocation();
	const navigate = useNavigate();

	const [onlineUserList, setOnlineUserList] = useState<User[]>();
	const [allOnlineUsers, setAllOnlineUsers] = useState<User[]>([]);
	const [notifications, setNotification] = useState<number[]>()
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [userGroups, setUserGroups] = useState<string[]>([]);
	const [selectedTab, setSelectedTab] = useState('online');
	

	useEffect(() => {
		const interval = setInterval(() => {

			if (selectedTab === 'groups') {
				fetchUserGroups();
			} else {
				// Lógica para buscar usuários online
				fetchall.execute().then((data) => {
					setAllOnlineUsers(data);
					let filteredUsers = RemoveUserByName(data, location.state.sender.name);
					setOnlineUserList(filteredUsers);
				})
			}
	
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

	 // Função para buscar os grupos do usuário
	 async function fetchUserGroups() {
        try {
            const groups = await getChatGroup.execute(location.state.sender._id);
			if (groups !== null) {
				setUserGroups(groups);
			} else {
				console.error('Nenhum grupo encontrado para o usuário');
			}
        } catch (error) {
            console.error('Erro ao buscar os grupos do usuário:', error);
        }
    }

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
			let keys: ElGamalKeys;

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

	async function ToGroup(group: string) {
		const currentUserID = location.state.sender._id;
		const userIds = [...allOnlineUsers.map(user => user._id), currentUserID];
		navigate('/group', {
			state: { sender: location.state.sender, user_ids: userIds, group_name: group},
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
			<div>
                    {/* Abas para selecionar entre "Online Users" e "Seus Grupos" */}
                    <button onClick={() => setSelectedTab('online')}
					style={{
						textAlign: 'left',
						font: 'icon',
						marginTop: '5%',
						marginLeft: '5%',
						fontSize: 20,
						fontWeight: 'bold',
						color: 'primary',
						border: 'none',
           				background: 'none',
            			cursor: 'pointer',
					  }}
					>Online Users</button>
                    <button onClick={() => setSelectedTab('groups')}
					style={{
						textAlign: 'left',
						font: 'icon',
						marginTop: '5%',
						marginLeft: '5%',
						fontSize: 20,
						fontWeight: 'bold',
						color: 'primary',
						border: 'none',
           				background: 'none',
            			cursor: 'pointer',
					  }}
					>Seus Grupos</button>
                </div>
			<hr style={{ height: 1, backgroundColor: 'black' }} />
			<div className="itens-list">
                    {selectedTab === 'online' && onlineUserList?.map((user, index) => (
                        <UserChatCard
                            key={index}
                            data={user}
                            notification={notifications !== undefined ? notifications[index] : 0}
                            onChatStart={() =>
                                navigate('/private', {
                                    state: { sender: location.state.sender, recipient: user },
                                })
                            }
                        />
                    ))}
                    {selectedTab === 'groups' && userGroups.map((group, index) => (
                        <div key={index} className="group-item">
                            {/* Exibir informações sobre o grupo */}
							<button
						style={{
							backgroundColor: userCardBackground,  
							borderRadius: '15px', 
							padding: '25px 10px', // Adicione preenchimento interno para separar o texto da borda
							fontSize: '20px', // Aumente o tamanho da fonte
							margin: '10px 0', 
							fontWeight: 'bold',
							border: 'none',
							width: '100%'
						}}
						onClick={() => ToGroup(group)}
						>
						{group}
						</button>
                        </div>
                    ))}
                </div>
			
			<img
			  src="src/screens/img/Vector.png" // Replace with your image path
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