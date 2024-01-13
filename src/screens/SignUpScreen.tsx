import { useNavigate } from "react-router-dom";
import { primary } from "../theme/colors";
import UserService from "../services/UserService";
import { useEffect, useState } from "react";
import CreateUser from "../use_cases/users/CreateUser";

const createUser = new CreateUser(new UserService());

export default function SignUpScreen() {

	const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		sessionStorage.removeItem('privateKey');
		sessionStorage.removeItem('hasExecuted');

	}, []);

	async function SendData() {

        try {
                const createdUser = await createUser.execute(name, email, password);

                navigate("/login",);

        } catch (error: any) {
            console.log(error)
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
					color: primary}}>Name</h4>
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
						setName(e.target.value);
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
				onClick={SendData}>Sign Up</button>

            <div style={{ marginTop: "2%", textAlign: "center" }}>
					<p
					style={{ color: primary, textDecoration: "underline", cursor: "pointer" }}
					onClick={() => navigate("/login")}
					>
					Ir para tela de login
					</p>
				</div>
                

		</div>
			
	)
}
