import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { Message } from '../entities/ChatGroup';
import { useLocation, useNavigate } from 'react-router';
import { CreateChatGroup } from "../use_cases/messages/CreateChatGroup";
import ChatGroupService from "../services/ChatGroupService";
import { AddMessageToGroupChat } from '../use_cases/messages/AddMessageToGroup';
import { GetGroupChatMessages } from '../use_cases/messages/GetGroupChatMessages';
import { FindUserById } from '../use_cases/users/FindUser';
import  UserService  from '../services/UserService'
import ElgamalService from '../services/ElgamalService';
import { ElGamalKeys } from '../entities/Elgamal';
import { GetUsersGroupChat } from '../use_cases/messages/GetUsersGroupChat';
import { RemoveUserGroupChat } from '../use_cases/messages/RemoveUserGroupChat';
import { DeleteChatGroup } from '../use_cases/messages/DeleteChatGroup';
import { GetGroupChatByUser } from '../use_cases/messages/GetGoupChatByUser';

const createGroupChat = new CreateChatGroup(new ChatGroupService())
const sendMessage = new AddMessageToGroupChat(new ChatGroupService())
const getGroupMessages = new GetGroupChatMessages(new ChatGroupService())
const findUser = new FindUserById(new UserService())
const getUsers = new GetUsersGroupChat(new ChatGroupService())
const removeUser = new RemoveUserGroupChat(new ChatGroupService())
const deleteChat = new DeleteChatGroup(new ChatGroupService())
const crypto = new ElgamalService();

export default function GroupChatScreen() {

	const navigate = useNavigate();
	const location = useLocation();
	const [messages, setMessages] = useState<Message[]>([]);
	const [senderMessages, setSenderMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const chatEndRef = useRef<HTMLDivElement>(null);
	const topBarRef = useRef<HTMLDivElement>(null);

	function executeOnce() {

			const hasExecuted = sessionStorage.getItem('hasExecutedChat');
			//sessionStorage.setItem('publicKey', JSON.stringify(location.state.recipient.pub_key));
		
			if (!hasExecuted) {
				createGroupChat.execute(location.state.user_ids, location.state.group_name).then((newGroupChat) => {
					sessionStorage.setItem('GroupChatId', String(newGroupChat?._id));
				})

				sessionStorage.setItem('hasExecutedChat', "true");
			}
		}

	executeOnce()


	const closeChat = async () => {
		const chatId = String(sessionStorage.getItem("GroupChatId"))
		const users = await getUsers.execute(chatId)

		if (users && users.length > 1){
			removeUser.execute(chatId,location.state.sender._id )
		} else{
			deleteChat.execute(chatId)
		}

		navigate('/chat', {
				state: { sender: location.state.sender,},
		})
	};


	// Function to load messages from sessionStorage
		const loadMessagesFromStorage = () => {
			const storedMessages = sessionStorage.getItem('senderMessages');
			if (storedMessages) {
				setSenderMessages(JSON.parse(storedMessages));
			}
		};

		// Function to save messages to sessionStorage
		const saveMessagesToStorage = (messagesToSave: Message[]) => {
			sessionStorage.setItem('senderMessages', JSON.stringify(messagesToSave));
		};



	useEffect(() => {
		const interval = setInterval(() => {

		saveMessagesToStorage(senderMessages);
		loadMessagesFromStorage();

		// Caso exista um chat, retorne seu conteudo
		const chatId = String(sessionStorage.getItem("GroupChatId"))
		getGroupMessages.execute(chatId).then((message) => {
			if(message) {
			getMessages(message)
			}
		})

		}, 1000);
		
		return () => clearInterval(interval);

	// if (chatEndRef.current) {
		// chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
		//}
	});

	const getMessages = async (msg_list: string[][]) => {

			const privateKey = sessionStorage.getItem('privateKey');
			const tempArray: Message[] = [];

			if(privateKey) {

				let senderPos = 0;

				for (let i = 0; i < msg_list.length; i++) {

					const user = await findUser.execute(msg_list[i][1]);
					console.log("O usuário encontrado na descripto é ", user._id)

					if(privateKey && user && user.pub_key){
						const keys: ElGamalKeys = {
							publicKey: user.pub_key,
							privateKey: Number(privateKey)
						};

						console.log("A chave na descripto é ", user.pub_key)

						// Se a mensagem for do usuário remetente
						 if (msg_list[i][2] === location.state.sender._id && i % 5 === 0){
				
							tempArray.push(senderMessages[senderPos])
							
							senderPos = senderPos + 1;
							
						} 
						// Se for do usuario destinatario
						else { 

							if(msg_list[i][2] === location.state.sender._id) continue;
							else {

								if(msg_list[i][1] === location.state.sender._id){

									const user = await findUser.execute(msg_list[i][2]);
									
		
									const decryptedMsg = crypto.decryptation(msg_list[i][0], keys)
									
									let newMessage: Message = {
										text: decryptedMsg,
										isUser: false,
										senderName: user.name
									};
			
									tempArray.push(newMessage)

								}

								
							}

						}
					}
				}
				setMessages(tempArray)
			}
		};

	const handleMessage = async () => {

		const userIds = location.state.user_ids

		if (inputValue.trim() !== '') {
			const newMessage: Message = {
				text: inputValue,
				isUser: true,
				senderName: location.state.sender.name
			};
			
			setSenderMessages([...senderMessages, newMessage])

			
			for (let i = 0; i < userIds.length; i++) {

				const user = await findUser.execute(userIds[i]);
				console.log("Usuario encontrado: ", user)

				if (user && user.pub_key && user._id) {
					// Passo 2: Encripte a mensagem com a chave pública do usuário atual
					console.log("A chave pub dos usuers no encriptation é ", user.pub_key)
					const cipherText = crypto.encryptation(newMessage.text, user.pub_key);
					const chatId = String(sessionStorage.getItem('GroupChatId'));
				
					// Envie a mensagem encriptada para o usuário correspondente
					sendMessage.execute(chatId, cipherText, user._id, location.state.sender._id);
				}
			}
			
			setInputValue('');
		}
	};



	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const chatContainerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		padding: '0px',
		height: '100vh',
		overflowY: 'auto',
		position: 'relative',
		margin: '0',
	};

	const userMessageStyle: React.CSSProperties = {
		alignSelf: 'flex-end',
		backgroundColor: '#8a2be2',
		color: 'white',
		borderRadius: '15px', 
		padding: '8px 12px', 
		marginBottom: '8px',
		maxWidth: '90%',
		marginLeft: 'auto',
	};

	const otherMessageStyle: React.CSSProperties = {
		alignSelf: 'center',
		backgroundColor: '#C59DF7',
		color: 'black',
		borderRadius: '15px',
		padding: '8px 12px', 
		marginBottom: '8px',
		maxWidth: '90%',
		marginRight: 'auto',
	};

	const inputContainerStyle: React.CSSProperties = {
		marginTop: 'auto',
		display: 'flex',
		alignItems: 'center',
		borderTop: '1px solid #ccc',
		padding: '10px 20px',
		justifyContent: 'space-between',
		position: 'fixed', 
		bottom: '0',
		background: 'white',
		zIndex: 1,
		width: '86%',
	};

	const inputStyle: React.CSSProperties = {
		flex: '1',
		padding: '10px',
		borderRadius: '20px',
		border: '1px solid #ccc',
	};

	const sendButtonStyle: React.CSSProperties = {
		marginLeft: '10px',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		fontSize: '24px',
		color: '#8a2be2',
	};

	const senderNameStyle: React.CSSProperties = {
		fontFamily: 'Rubik', 
		fontSize: '12px', 
		fontWeight: 500,
		color: '#2D3F65',
		marginBottom: '5px'
	};
	const topBarStyle: React.CSSProperties = {
		position: 'sticky',
		top: '0',
		width: '100%',
		backgroundColor: 'white',
		zIndex: 2,
		marginBottom: '20px'
	};

	const recipientNameStyle: React.CSSProperties = {
		fontFamily: 'Rubik',
		fontSize: '20px',
		fontWeight: 500,
		lineHeight: '15px',
		letterSpacing: '0em',
		margin: 15,
		textAlign: 'left',
		marginBottom: '30px',
		marginTop: '15px',
		color:'#5034C4',
	};

	const closeButtonStyle: React.CSSProperties = {
		position: 'absolute',
		top: '10px',
		right: '10px',
		cursor: 'pointer',
		fontSize: '24px',
		color: '#8a2be2',
	};

	return (
		<div style={chatContainerStyle}>
		<div style={topBarStyle} ref={topBarRef}>
			<div style={recipientNameStyle}>{location.state.group_name}</div>
			<FaTimes style={closeButtonStyle} onClick={closeChat} />
			<hr style={{ width: '100%', color: 'black' }} />
		</div>
		{messages.map((message, index) => (
			
			<>
				{ message?.isUser ? (
					<div 
						key={index}
						style={userMessageStyle}>
							{message?.text}
					</div>
					
				):(
					<div
						key={index} 
						style={otherMessageStyle}>
							<div style={senderNameStyle}>{message?.senderName}</div>
							<span style={{ fontSize: '14px', fontFamily: 'Rubick', color: 'black' }}>
									{message?.text}
							</span>
					</div>
				)}
			</>
		))}

		<div ref={chatEndRef} />

		{/* Input para enviar mensagem */}
		<div style={inputContainerStyle}>
			<input
			type="text"
			placeholder="Escreva sua mensagem"
			style={inputStyle}
			value={inputValue}
			onChange={handleInputChange}
			onKeyPress={(event) => {
				if (event.key === 'Enter') {
				handleMessage();
				}
			}}
			/>
			<button style={sendButtonStyle} onClick={handleMessage}>
			<FaPaperPlane />
			</button>
		</div>
		</div>
	);
};
