import { RouterProvider } from "react-router"
import { router } from "./routes"
import Chat from "./screens/PrivateChatScreen";
const messages = [
  { text: 'Olá! Como vai?', isUser: true },
  { text: 'Tudo bem, e você?', isUser: false },
  { text: 'Estou ótimo, obrigado! Gostaria de saber que horas vc sai para que possamos marcar algo para se encontrar', isUser: true },
 

];

function App() {

  return (
    <div className="App">
    <Chat messages={messages} recipientName="Lidia" />
  </div>
  )
}

export default App