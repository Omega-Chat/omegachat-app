import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useLocation } from 'react-router';
// import ElgamalService from '../services/ElgamalService';
 import ChatService from '../services/ChatService';
 import { CreateChat } from '../use_cases/messages/CreateChat';
import { AddMessageToChat } from '../use_cases/messages/AddMessage';
import { useNavigate } from "react-router-dom";

interface Message {
  text: string;
  isUser: boolean;
}

export default function PrivateChatScreen() {
  
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const chat = new CreateChat(new ChatService)
  const addMessage = new AddMessageToChat(new ChatService) 
  const navigate = useNavigate();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const initializeChat = async () => {
      try {
        const createdChat = await chat.execute(location.state.sender._id, "657e703fca311d986e7d06d7" ); // Você pode passar parâmetros, se necessário
        navigate("/chats")
        console.log('Chat criado:', createdChat);
      } catch (error) {
        console.error('Erro ao criar o chat:',);
      }
    };
    initializeChat();

  }, [messages]);

  const sendMessage = async () => {

    if (inputValue.trim() !== '') {
      const newMessage: Message = {
        text: inputValue,
        isUser: true,
      };

      try {
        // Adicionar mensagem ao chat
         await addMessage.execute(location.state.chatId, newMessage.text);
         navigate("/${chatId}/messages")
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages); 
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

  return (
    <div style={chatContainerStyle}>
      <div style={topBarStyle} ref={topBarRef}>
        <div style={recipientNameStyle}>{"Lidia"}</div>
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
              sendMessage();
            }
          }}
        />
        <button style={sendButtonStyle} onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};
