import { useNavigate } from "react-router-dom";
import { primary } from "../theme/colors";
import UserService from "../services/UserService";
import Login from "../use_cases/users/Login";
import { useEffect, useState } from "react";
import bcrypt from 'bcryptjs';
import axios from 'axios';



const loginUser = new Login(new UserService());

export default function ForgotPassScreen() {

	const [email, setEmail] = useState("");

	const navigate = useNavigate();



	async function Reset() {

        try {
            axios.post('forgot', email).then(
                res => {
                    console.log(res)
                }
            ).catch(
                err => {
                    console.log(err);
                }
            )

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

            <h3
				style={{
					textAlign: "left",
					marginLeft: 25,
					font: "icon",
					fontSize: 20,
					fontWeight: "bold",
					color: primary}}>Mudar senha</h3>

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
			<button
				style={{
					marginRight: "5%",
					marginLeft: "6%",
					marginTop: "10%",
					height: 50,
					width: 352,
					backgroundColor: primary,
					color: "white",
					borderRadius: 5,
					fontSize: 15

				}}
				onClick={Reset}>Submeter</button>

			<div style={{ marginTop: "2%", textAlign: "center" }}>
					<p
					style={{ color: primary, textDecoration: "underline", cursor: "pointer" }}
					onClick={() => navigate("/")}
					>
					Voltar para tela de login
					</p>
				</div>

		</div>
			
	)
}
