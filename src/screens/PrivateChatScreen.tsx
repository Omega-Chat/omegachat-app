import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatProps {
  messages: Message[];
  recipientName: string;
}

const Chat: React.FC<ChatProps> = ({ messages: initialMessages, recipientName }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      const newMessage: Message = {
        text: inputValue,
        isUser: true,
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
    backgroundColor: '#dcdcdc',
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
    marginBottom: '10px',
    marginTop: '15px',
    color:'#5034C4',
  };

  return (
    <div style={chatContainerStyle}>
      <div style={topBarStyle} ref={topBarRef}>
        <div style={recipientNameStyle}>{recipientName}</div>
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

export default Chat;
