import React, { useEffect, useState } from 'react';
import { User } from '../entities/User';
import UserService from '../services/UserService';
import { FetchAll } from '../use_cases/users/FetchAll';
import { useLocation, useNavigate } from 'react-router-dom';
import UserChatCard from "../components/userChatCard";

const fetchall = new FetchAll(new UserService())

function Popup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {

    const [onlineUserList, setOnlineUserList] = useState<User[]>();
	  const [allOnlineUsers, setAllOnlineUsers] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
		const interval = setInterval(() => {
			fetchall.execute().then((data) => {
				setAllOnlineUsers(data);
				let filteredUsers = RemoveUserByName(data, location.state.sender.name);
				setOnlineUserList(filteredUsers);
			})

		  }, 2000);
	  
		  return () => clearInterval(interval);


	});

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

    const handleNameClick = (userId: string) => {
        // Verifica se o usuário já está na lista de usuários selecionados
        if (selectedUserIds.includes(userId)) {
            // Remove o usuário da lista se já estiver selecionado
            setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
        } else {
            // Adiciona o usuário à lista se ainda não estiver selecionado
            setSelectedUserIds([...selectedUserIds, userId]);
        }
    };

    const handleGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.target.value);
  };

      async function ToGroup() {
        const currentUserID = location.state.sender?._id ?? '';
        const userIds = [...selectedUserIds, currentUserID]; // Adiciona o ID do usuário atual, ou uma string vazia se não estiver disponível
        navigate('/group', {
            state: { sender: location.state.sender, user_ids: userIds, group_name: groupName },
        });
	}

  if (!isOpen) {
    return null;
  }

  const header: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  }
  const content: React.CSSProperties = {
    backgroundColor: '#fff',
    width: '300px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  }

  const overlay: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

const closeBtn : React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#333',
    fontSize: '20px',
    cursor: 'pointer',
  }

  const body: React.CSSProperties = {
    padding: '10px 0',
  }
  const userListStyle: React.CSSProperties = {
    borderRadius: '8px', // Bordas arredondadas
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Sombra para destacar
    padding: '20px', // Espaçamento interno
    backgroundColor: '#f0f0f0', // Cor de fundo
    marginBottom : '15px'
  };
  
  const userItemStyle = (isSelected: boolean): React.CSSProperties => ({
    marginBottom: '8px',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: isSelected ? '#8a2be2' : '#ffffff',
    color: isSelected ? '#ffffff' : '#000000',
    cursor: 'pointer',
  });

  const buttonStyle: React.CSSProperties ={
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#8a2be2',
    padding: '7px 7px',
    color: '#ffffff'
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={content} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h2>Criar Novo Grupo</h2>
          <button style={closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={body}>
        <div className="items-list" style={userListStyle}>
        <input
              type="text"
              placeholder="Nome do Grupo"
              value={groupName}
              onChange={handleGroupNameChange}
              style={{ marginBottom: '15px',
                       border: 'none',
                       padding: '8px 10px',
                       borderRadius: '5px'
                     }}
            />
            {onlineUserList?.map((user) => (
              <div key={user._id}
              style={userItemStyle(selectedUserIds.includes(user._id ?? ''))}
              onClick={() => user._id && handleNameClick(user._id)}>
                <span>{user.name}</span>
                {/* Você pode adicionar mais informações do usuário aqui, se necessário */}
              </div>
			  ))}
			</div>
          <button onClick={ToGroup} style={buttonStyle}>Criar grupo</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
