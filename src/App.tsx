import { RouterProvider } from "react-router"
import { router } from "./routes"
import { useEffect } from "react";
import { ExitChat } from "./use_cases/users/ExitChat";
import UserService from "./services/UserService";
//import Chat from "./screens/PrivateChatScreen";

const exitchat = new ExitChat(new UserService())

function App() {

  useEffect(() => {
    const handleTabClose = () => {

      const loggeduser = sessionStorage.getItem('loggeduser');

      if(loggeduser !== null){
        exitchat.execute(loggeduser).then((user) => {
          console.log(user);        
        })
      };
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);
  

  return (
    // <div className="App">
    //   <Chat messages={messages} recipientName="Lidia" />
    // </div>
    <RouterProvider router={router}/>
  )
}

export default App