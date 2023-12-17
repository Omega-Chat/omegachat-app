import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface Message {
  text: string;
  isUser: boolean;
  senderName: string;
}

interface ChatProps {
  messages: Message[];
}

const GroupChat: React.FC<ChatProps> = ({ messages: initialMessages }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      const newMessage: Message = {
        text: inputValue,
        isUser: true,
        senderName: 'Nome do Usuário', 
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages); 
      setInputValue('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
    marginRight: '0px', 
    marginBottom: '8px',
    maxWidth: '90%',
  };

  const otherMessageStyle: React.CSSProperties = {
    alignSelf: 'flex-start',
    backgroundColor: '#dcdcdc',
    color: 'black',
    borderRadius: '15px',
    padding: '8px 12px', 
    marginBottom: '8px',
    maxWidth: '90%',
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
    color: '#FFFFFF',
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
    marginBottom: '10px',
    marginTop: '15px',
    color:'#5034C4',
  };

  return (
    <div style={chatContainerStyle}>
      <div style={topBarStyle} ref={topBarRef}>
        <div style={recipientNameStyle}>{"Grupo de Segurança"}</div>
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
        />
        <button style={sendButtonStyle} onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
