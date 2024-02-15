import { useNavigate } from "react-router-dom";
import { primary } from "../theme/colors";
import UserService from "../services/UserService";
import Login from "../use_cases/users/Login";
import { useEffect, useState } from "react";
import ValidationMessage from "../components/validationMessage";



const loginUser = new Login(new UserService());

export default function LoginScreen() {

	const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
	const [showMessageError, setShowMessageError] = useState(false)
  	const [messageError, setMessageError] = useState("")

	const navigate = useNavigate();

	useEffect(() => {
		sessionStorage.removeItem('privateKey');
		sessionStorage.removeItem('hasExecuted');

	}, []);
	

	async function SendData() {

        try {
				setShowMessageError(false);
                const loggeduser = await loginUser.execute(email, password);
				
				if(loggeduser?._id !== undefined){
					console.log(loggeduser._id)
					sessionStorage.setItem('loggeduser', loggeduser._id);
					navigate("/chat", {state: {sender: loggeduser}});
				}
				
        } catch (error: any) {
			setShowMessageError(true);
			setMessageError(error.message);
        }

    }

	return (
		<div 
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				overflow: "auto",
			}}>
            <h1 
				style={{
					textAlign: "center",
					marginTop: "50%",
					font: "icon",
					fontSize: 35,
					fontWeight: "bold",
					color: primary}}>OmegaChat</h1>

			{showMessageError && <ValidationMessage error_text={messageError} />}
			
			<h3
				style={{
					textAlign: "left",
					marginLeft: 25,
					font: "icon",
					fontSize: 20,
					fontWeight: "bold",
					color: primary}}>Login</h3>

			<div 
				style={{
					marginRight: "5%",
					marginLeft: "5%",
				}}>
				<h4 
					style={{
					textAlign: "left",
					marginTop: 0,
					marginBottom: 0,
					color: primary}}>Email Address</h4>
				<input 
					style={{
						width: 352,
						height: 40,
						marginTop: 5,
						marginBottom: 10,
						backgroundColor: "white",
						borderWidth: 2,
						borderRadius: 5,
						borderColor: primary
					}}
					type="text"
					onChange={e => {
						setEmail(e.target.value);
					}}/>

			</div>
			<div 
				style={{
					marginRight: "5%",
					marginLeft: "5%",
				}}>
				<h4 
					style={{
					textAlign: "left",
					marginTop: 0,
					marginBottom: 0,
					color: primary}}>Password</h4>
				<input 
					style={{
						width: 352,
						height: 40,
						marginTop: 5,
						backgroundColor: "white",
						borderWidth: 2,
						borderRadius: 5,
						borderColor: primary
					}}
					type="text"
					onChange={e => {
						setPassword(e.target.value);
					}}/>

			</div>
			<button
				style={{
					marginRight: "5%",
					marginLeft: "6%",
					marginTop: "30%",
					height: 50,
					width: 352,
					backgroundColor: primary,
					color: "white",
					borderRadius: 5,
					fontSize: 15

				}}
				onClick={SendData}>Log In</button>

			<div style={{ marginTop: "2%", textAlign: "center" }}>
					<p
					style={{ color: primary, textDecoration: "underline", cursor: "pointer" }}
					onClick={() => navigate("/signup")}
					>
					Voltar para tela de cadastro
					</p>
			</div>

			<div style={{ marginTop: "2%", textAlign: "center" }}>
					<p
					style={{ color: primary, textDecoration: "underline", cursor: "pointer" }}
					onClick={() => navigate("/forgot")}
					>
					Esqueci minha senha
					</p>
			</div>

		</div>
			
	)
}
