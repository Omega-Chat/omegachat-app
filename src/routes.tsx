import {createBrowserRouter} from 'react-router-dom'
import LoginScreen from './screens/LoginScreen'
import HomeChatScreen from './screens/HomeChatScreen'
import PrivateChatScreen from './screens/PrivateChatScreen'
import GroupChatScreen from './screens/GroupChatScreen'
import SignUpScreen from './screens/SignUpScreen'
import ForgotPassScreen from './screens/ForgotPassScreen'

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
     },
     {
        path: '/forgot',
        element: <ForgotPassScreen/>
    }
  ])