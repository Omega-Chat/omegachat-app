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



const crypto = new ElgamalService();
const fetchall = new FetchAll(new UserService())
const updatepubkey = new UpdatePubKey(new UserService())
const exitchat = new ExitChat(new UserService())


export default function HomeChatScreen() {

	const location = useLocation();
	const navigate = useNavigate();

	const [onlineUserList, setOnlineUserList] = useState<User[]>();

	useEffect(() => {
		let keys = CryptographyTest();
		fetchall.execute().then((data) => {
			let filteredUsers = RemoveUserByName(data, location.state.sender.name);
			setOnlineUserList(filteredUsers);
		})
		updatepubkey.execute(location.state.sender._id, keys?.publicKey)
		
	}, []);

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

			do {

				keys = crypto.generateKeyPair();
	
				const cipherText = crypto.encryptation(test_msg, keys.publicKey)
		
				decipherText = crypto.decryptation(cipherText, keys);

			} while (test_msg !== decipherText);

			// console.log(decipherText);

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



	return (
		<div className="container">
            <h1 
				style={{
					textAlign: "left",
					font: "icon",
					fontSize: 40,
					color: primary}}>Chat</h1>
			<div>
				<h3 
					style={{
						textAlign: "left",
						font: "icon",
						marginTop: "5%",
						marginLeft: "5%",
						fontSize: 20,
						fontWeight: "bold",
						color: primary}}>Online Users</h3>
				<hr style={{
					height: 1,
					backgroundColor: "black" 
				}}/>
				<div className="itens-list">
					{onlineUserList?.map((user, index) =>
						<UserChatCard
							key={index}
							data={user}
							onChatStart={() => navigate("/private", {state: {recipient: user}})}

							/>
						)	
					}
				</div>
				<button
					style={{
						marginRight: "5%",
						marginLeft: "6%",
						marginTop: "100%",
						height: 50,
						width: 352,
						backgroundColor: leaveChat,
						color: "black",
						fontWeight: "bold",
						borderRadius: 5,
						fontSize: 20

					}}
					onClick={LeaveChat}>Leave Chat</button>
			</div>
		</div>
	)
}
