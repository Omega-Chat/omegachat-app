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

const createGroupChat = new CreateChatGroup(new ChatGroupService())
const addMessage = new AddMessageToGroupChat(new ChatGroupService())
const getGroupMessages = new GetGroupChatMessages(new ChatGroupService())
const findUser = new FindUserById(new UserService())
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
			createGroupChat.execute(location.state.user_ids).then((newGroupChat) => {
				sessionStorage.setItem('GroupChatId', String(newGroupChat?._id));
			})

			sessionStorage.setItem('hasExecutedChat', "true");
		}
	}

  executeOnce()


  const closeChat = () => {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleMessage = async () => {

    const encryptedMessages = [];
    const userIds = location.state.user_ids

    if (inputValue.trim() !== '') {
      const newMessage: Message = {
        text: inputValue,
        isUser: true,
        senderName: location.state.sender.name
      };
      
      setSenderMessages([...senderMessages, newMessage])

      for (let i = 0; i < userIds.length; i++) {
        console.log("id de usuario", userIds[i])
        
        const user = await findUser.execute(userIds[i]);
        console.log("Usuario encontrado: ", user)
        if (user && user.pub_key) {
          const pub_key = user.pub_key;
          const userId = user._id
          console.log("Chave privada:", pub_key)
          // Passo 2: Encripte a mensagem com a chave pública do usuário atual
          const cipherText = crypto.encryptation(newMessage.text, pub_key);
          encryptedMessages.push({ userId, cipherText });
        }
      }

      for (const encryptedMessage of encryptedMessages) {
       // const { userId, cipherText } = encryptedMessage;
        const chatId = String(sessionStorage.getItem('GroupChatId'));
    
        // Envie a mensagem encriptada para o usuário correspondente
        //addMessage.execute(chatId, cipherText, userId);
      }

			

			setInputValue('');
		}
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

  const getMessages = (msg_list: string[][]) => {

		const privateKey = sessionStorage.getItem('privateKey');
		const tempArray: Message[] = [];

		if(privateKey) {

			//const keys: ElGamalKeys = {
				//publicKey: location.state.sender.pub_key,
				//privateKey: BigInt(privateKey)
			//};

			let senderPos = 0;

			for (let i = 0; i < msg_list.length; i++) {

				
				if (msg_list[i][1] === location.state.sender._id){
		
					tempArray.push(senderMessages[senderPos])
					
					senderPos = senderPos + 1;
					
				} 
				else {

					//const decryptedMsg = crypto.decryptation(msg_list[i][0], keys)
					
					let newMessage: Message = {
						text: msg_list[i][0],
						isUser: false,
            senderName: "Teste"
					};

					tempArray.push(newMessage)

				}
			}
			setMessages(tempArray)
		}
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
    alignSelf: 'flex-start',
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
        <div style={recipientNameStyle}>{"Grupo de Segurança"}</div>
        <FaTimes style={closeButtonStyle} onClick={closeChat} />
        <hr style={{ width: '100%', color: 'black' }} />
      </div>
      {messages.map((message, index) => (
        <div key={index}>
          <div style={message.isUser ? userMessageStyle : otherMessageStyle}>
            {!message.isUser && <div style={senderNameStyle}>{message.senderName}</div>}
            <div>
             <span style={{ fontSize: '14px', fontFamily: 'Rubick', color: 'black' }}>{message.text}</span>
              </div>
          </div>
        </div>
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
