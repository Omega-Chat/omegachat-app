import { useNavigate } from "react-router-dom";
import { primary } from "../theme/colors";

export default function LoginScreen() {

	const navigate = useNavigate();

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
					onChange={() => null}/>

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
					onChange={() => null}/>

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
				onClick={() => navigate("/chat")}>Log In</button>

		</div>
			
	)
}
