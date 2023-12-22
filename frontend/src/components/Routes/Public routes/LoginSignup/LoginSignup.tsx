import React, { FC, useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import awsExports from '../../../../aws-exports'
import { Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../App';

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_CLIENT_ID
  }
})

function LoginSignup() {

  const [jwt, setJwt] = useState('')
  const [output, setOutput] = useState('')
  const navigate = useNavigate();

  const { isUserAuthenticated, setIsUserAuthenticated, token, setToken } = useContext(UserContext);

  useEffect(() => {
    getToken();
  }, [])

  useEffect(() => {
    //console.log('change token' + token)
  }, [token])

  const getToken = async () => {
    const session = await Auth.currentSession();
    const receivedToken = session.getIdToken().getJwtToken();

    console.log(session)
    if (receivedToken != undefined) {
      setIsUserAuthenticated(true);
      setToken(receivedToken)
      navigate('/dashboard')

    }
  }

  return (
    <Authenticator components={{
      SignUp: {
        FormFields() {
          return (
            <>
              <div><label>Username</label></div>
              <input
                type="text"
                name="username"
                placeholder="Please enter your username"
              />
              <div><label>Password</label></div>
              <input
                type="password"
                name="password"
                placeholder="Please enter your password"
              />
              <div><label>Name</label></div>
              <input
                type="text"
                name="name"
                placeholder="Please enter your name"
              />
              <div><label>Email</label></div>
              <input
                type="text"
                name="email"
                placeholder="Please enter a valid email"
              />
              <div><label>Phone number</label></div>
              <input
                type="text"
                name="phone_number"
                placeholder="Please enter a valid number"
              />
              <div><label>Birth date</label></div>
              <input
                type="date"
                name="birthdate"
                placeholder="Please enter a valid date"
              />
            </>
          );
        },
      },

      SignIn: {
        //@ts-ignore
        FormFields(){
          return (
            <>
              <div><label>Password</label></div>
              <input
                type="password"
                name="password"
                placeholder="Please enter your password"
              />
              <div><label>Name</label></div>
              <input
                type="text"
                name="name"
                placeholder="Please enter your name"
              />
              <div><label>Email</label></div>
              <input
                type="text"
                name="email"
                placeholder="Please enter a valid email"
              />
              <div><label>Phone number</label></div>
              <input
                type="text"
                name="phone_number"
                placeholder="Please enter a valid number"
              />
              <div><label>Birth date</label></div>
              <input
                type="date"
                name="birthdate"
                placeholder="Please enter a valid date"
              />
            </>
          );
        },
      }
    }}
    >
      {({ signOut, user }) => {
        //console.log(user)
        setIsUserAuthenticated(true)
        return (
          <div>
            <button onClick={signOut}>Sign out</button>
            <div>{user?.username}</div>
            <div>{jwt}</div>
            <div>{token}</div>
            <br>
            </br>
          </div>
        )
      }}
    </Authenticator >
  )
}



export default LoginSignup;