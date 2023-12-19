import { RouterProvider } from "react-router"
import { router } from "./routes"
//import Chat from "./screens/PrivateChatScreen";


function App() {

  return (
    // <div className="App">
    //   <Chat messages={messages} recipientName="Lidia" />
    // </div>
    <RouterProvider router={router}/>
  )
}

export default App