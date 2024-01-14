import {createBrowserRouter} from 'react-router-dom'
import LoginScreen from './screens/LoginScreen'
import HomeChatScreen from './screens/HomeChatScreen'
import PrivateChatScreen from './screens/PrivateChatScreen'
import GroupChatScreen from './screens/GroupChatScreen'
import SignUpScreen from './screens/SignUpScreen'
// import PrivateChatScreen from './screens/PrivateChatScreen'
// import GroupChatScreen from './screens/GroupChatScreen'

//const messages = [
  //  { text: 'Olá! Como vai?', isUser: true },
    //{ text: 'Tudo bem, e você?', isUser: false },
    //{ text: 'Estou ótimo, obrigado! Gostaria de saber que horas vc sai para que possamos marcar algo para se encontrar', isUser: true },
  
  //];

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginScreen/>
    }, 
    {
        path: '/signup',
        element: <SignUpScreen/>
    },
    {
        path: '/chat',
        element: <HomeChatScreen/>
    },
    {
        path: '/private',
        element: <PrivateChatScreen />
    },
     {
         path: '/group',
         element: <GroupChatScreen/>
     }
  ])