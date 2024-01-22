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
import PlayerDashboard from './components/Routes/Private routes/playerdashboard'

import { Auth } from 'aws-amplify';
import Profile from './components/Routes/Public routes/Profile/profile'
import Tournaments from './components/Routes/Public routes/Tournament/Tournaments'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'
import Matches from './components/Routes/Public routes/Match/matches'
import MyLists from './components/Routes/Private routes/mylists'
import NavBarTop from './components/NavBar/NavBarTop'
import UserTopDiv from './components/UserTopDiv/userTopDiv'

import {CognitoUser} from 'amazon-cognito-identity-js';

export const CognitoUserContext = React.createContext();
export const isUserAuthenticatedContext = React.createContext();

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_CLIENT_ID,
  },
});

function App() {

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [cognitoUser, setCognitoUser] = useState(null);
  

  const getToken = async () => {
    const session = await Auth.currentSession();
    const receivedToken = session.getIdToken().getJwtToken();

    if (receivedToken != undefined) {
      setIsUserAuthenticated(true)

      Auth.currentUserPoolUser().then((user) => {
        setIsUserAuthenticated(true);
        console.log('Get current userpool user: ', user);
        setCognitoUser(user);
      }).catch((error) => {
        console.error("User not logged into the website", error);
        setIsUserAuthenticated(false);
        setCognitoUser(null);
      });

    } else {
      console.log("User not logged into the website")
      setIsUserAuthenticated(false)
      setCognitoUser(null)
    }
  }

  useEffect(() => {
    console.log("App mounted")
    getToken()

  }, [])


  return (
    <>
      <CognitoUserContext.Provider value={{ cognitoUser: cognitoUser, setCognitoUser: setCognitoUser }}>
        <isUserAuthenticatedContext.Provider value={{ isUserAuthenticated: isUserAuthenticated, setIsUserAuthenticated: setIsUserAuthenticated }}>

          <NavBar></NavBar>
          <UserTopDiv></UserTopDiv>
          {
            //match the following ml-24 to the width of the navbar; this applies a margin to the left so we have pages starting 24 units to the right of the navbar
          }
          <div className='xl:ml-24'>

            <NavBarTop></NavBarTop>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path='/tournaments' element={<Tournaments />}></Route>
              <Route path='/tournament/:tournamentID' element={<Tournament />}></Route>
              <Route path="/tournament/:tournamentID/:sessionID" element={<SessionPage />}></Route>
              <Route path="/contacts" element={<Contacts />}></Route>
              <Route path="/loginsignup" element={<LoginSignup />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
              <Route path="/profile/:nickname" element={<Profile />}></Route>
              <Route path="/match/:match_id" element={<Matches />}></Route>
              <Route path="/playerDashboard" element={<PlayerDashboard />}></Route>
              <Route path="/myLists" element={<MyLists />}></Route>
              {cognitoUser != undefined &&
                <Route path="/dashboard" element={<User />}></Route>
              }
              <Route path="/*" element={<NotFound />}></Route>
            </Routes>
          </div>

          <Footer></Footer>
        </isUserAuthenticatedContext.Provider>
      </CognitoUserContext.Provider>
    </>
  )
}

export default App
