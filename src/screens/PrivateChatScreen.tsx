import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { Message } from '../entities/Chat';
import ElgamalService from '../services/ElgamalService';
import ChatService from '../services/ChatService';
import { CreateChat } from '../use_cases/messages/CreateChat';
import { FindChat } from '../use_cases/messages/FindChat';
import { ElGamalKeys, ElGamalPublicKey } from '../entities/Elgamal';
import { SendMessage } from '../use_cases/messages/SendMessage';
import  UserService  from '../services/UserService'
import { FindUserById } from '../use_cases/users/FindUser';


const crypto = new ElgamalService();
const createChat = new CreateChat(new ChatService());
const findChat = new FindChat(new ChatService());
const sendMessage = new SendMessage(new ChatService());
const findUser = new FindUserById(new UserService())


export default function PrivateChatScreen() {

	const location = useLocation();
	const navigate = useNavigate();
	const [messages, setMessages] = useState<Message[]>([]);
	const [senderMessages, setSenderMessages] = useState<Message[]>([]);

	const [inputValue, setInputValue] = useState<string>('');
	const chatEndRef = useRef<HTMLDivElement>(null);
	const topBarRef = useRef<HTMLDivElement>(null);

	function executeOnce() {

		const hasExecuted = sessionStorage.getItem('hasExecutedChat');
		sessionStorage.setItem('publicKey', JSON.stringify(location.state.recipient.pub_key));
	
		if (!hasExecuted) {
			createChat.execute(location.state.sender._id, location.state.recipient._id).then((newChat) => {
				sessionStorage.setItem('ChatId', String(newChat?._id));
			})

			sessionStorage.setItem('hasExecutedChat', "true");
		}
	}

	executeOnce();


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

	const closeChat = () => {
		navigate('/chat', {
				state: { sender: location.state.sender,},
			})
	};

	useEffect(() => {
			const interval = setInterval(() => {

				saveMessagesToStorage(senderMessages);
				loadMessagesFromStorage();

				// Caso exista um chat, retorne seu conteudo
				findChat.execute(location.state.sender._id, location.state.recipient._id).then((chat) => {
					if(chat) {
						sessionStorage.setItem('ChatId', String(chat?._id));
						getMessages(chat.msg_list)
					}
				})
	
			  }, 1000);
		  
			  return () => clearInterval(interval);
	
		});

	// const doesElementExist = (array: Message[], attributeName: keyof Message, attributeValue: string | number) => {
	// 	return array.some(obj => obj[attributeName] === attributeValue);
	// };

	const getMessages = async (msg_list: string[][]) => {

		const privateKey = sessionStorage.getItem('privateKey');
		const tempArray: Message[] = [];

		const user = await findUser.execute(location.state.sender._id)
		console.log("A chave pública do objeto na decriptação é:", user.pub_key)

		if(privateKey && user && user.pub_key) {

			const keys: ElGamalKeys = {
				publicKey: user.pub_key,
				privateKey: Number(privateKey)
			};

			console.log('Esse é o usuário na decriptação: ', findUser.execute(location.state.sender._id))

			console.log("O id da pessoa no decryptation é: ", location.state.sender._id)
			console.log("Se fosse utizado o recipient aqui a chave pub seria: ", location.state.sender.pub_key)

			let senderPos = 0;

			for (let i = 0; i < msg_list.length; i++) {

				
				if (msg_list[i][1] === location.state.sender._id){
		
					tempArray.push(senderMessages[senderPos])
					
					senderPos = senderPos + 1;
					
				} 
				else {
					console.log("Aqui no arquivo private chat a public key é: ", location.state.sender.pub_key)
					const decryptedMsg = crypto.decryptation(msg_list[i][0], keys)
					
					let newMessage: Message = {
						text: decryptedMsg,
						isUser: false,
					};

					tempArray.push(newMessage)

				}
			}
			setMessages(tempArray)
		}
	};

	const handleMessage = async () => {
		console.log("O id da pessoa no encryptation é: ", location.state.recipient._id)
		console.log("Sua chave pública é", location.state.recipient.pub_key)
		console.log('Esse é o usuário na encriptação: ', findUser.execute(location.state.recipient._id))

		const user = await findUser.execute(location.state.recipient._id)
		console.log("A chave pública do objeto na encriptação é:", user.pub_key)
		const pub_key: any = user.pub_key

		if (inputValue.trim() !== '') {
			const newMessage: Message = {
				text: inputValue,
				isUser: true,
			};

			setSenderMessages([...senderMessages, newMessage])

			console.log("aqui a pubkey é", pub_key)
			console.log("")
			const cipherText = crypto.encryptation(newMessage.text, pub_key)
			const chatId = String(sessionStorage.getItem("ChatId"))
			sendMessage.execute(chatId, cipherText, location.state.sender._id)

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

	const topBarStyle: React.CSSProperties = {
		position: 'sticky',
		top: '0',
		width: '100%',
		backgroundColor: 'white',
		zIndex: 2,
	};

	const messageStyle: React.CSSProperties = {
		margin: '5px 0',
		padding: '10px',
		borderRadius: '8px',
		maxWidth: '70%',
		wordWrap: 'break-word',
	};

	const userMessageStyle: React.CSSProperties = {
		alignSelf: 'flex-end',
		backgroundColor: '#8a2be2',
		color: 'white',
	};

	const otherMessageStyle: React.CSSProperties = {
		alignSelf: 'flex-start',
		backgroundColor: '#C59DF7',
		color: 'black',
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
			<div style={recipientNameStyle}>{location.state.recipient.name}</div>
			<FaTimes style={closeButtonStyle} onClick={closeChat} />
			<hr style={{ width: '100%' }} />
		</div>

		{messages.map((message, index) => (
			<div
			key={index}
			style={
				message.isUser ? { ...messageStyle, ...userMessageStyle } : { ...messageStyle, ...otherMessageStyle }
			}
			>
			{message.text}
			</div>
		))}
		<div ref={chatEndRef} />
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
