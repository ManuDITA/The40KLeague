import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NavBar from './components/NavBar/NavBar'
import './App.css'
import Home from './components/Routes/Public routes/Home/Home'
import Footer from './components/Footer/Footer'
import { Routes, Route } from "react-router-dom";
import Contacts from './components/Routes/Public routes/Contacts/Contacts'
import SessionPage from './components/Routes/Public routes/Session/SessionPage'
import LoginSignup from './components/Routes/Public routes/LoginSignup/LoginSignup'
import NotFound from './components/Routes/Public routes/NotFound/NotFound'
import User from './components/Routes/Private routes/user'
import React from 'react'
import Logout from './components/Routes/Public routes/LoginSignup/Logout'
import Tournament from './components/Routes/Public routes/Tournament/Tournament'

import { Auth } from 'aws-amplify';
import Profile from './components/Routes/Public routes/Profile/profile'
import Tournaments from './components/Routes/Public routes/Tournament/Tournaments'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'


export const UserContext = React.createContext();
export const AuthContext = React.createContext();


Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_CLIENT_ID,
  },
});

function App() {

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [token, setToken] = useState(undefined);

  const getToken = async () => {
    const session = await Auth.currentSession();
    const receivedToken = session.getIdToken().getJwtToken();

    if (receivedToken != undefined) {
      console.log("A user is logged in: ", session.accessToken.payload)
      setIsUserAuthenticated(true)
      setToken(receivedToken)
    } else{
      console.log("No token, user not logged into the website")
      console.log(session)
      setIsUserAuthenticated(false)
    }
  }

  useEffect(() => {
    console.log("App mounted")
    getToken()

  }, [])

  return (
    <>
      <UserContext.Provider value={{ isUserAuthenticated: isUserAuthenticated, setIsUserAuthenticated: setIsUserAuthenticated, token: token, setToken: setToken }}>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path='/tournaments' element={<Tournaments />}></Route>
          <Route path='/tournament/:tournamentID' element={<Tournament />}></Route>
          <Route path="/tournament/:tournamentID/:sessionID" element={<SessionPage />}></Route>
          <Route path="/contacts" element={<Contacts />}></Route>
          <Route path="/loginsignup" element={<LoginSignup />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/profile/:nickname" element={<Profile />}></Route>
          {isUserAuthenticated && 
            <Route path="/dashboard" element={<User />}></Route>}
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>

        <Footer></Footer>
      </UserContext.Provider>
    </>
  )
}

export default App
