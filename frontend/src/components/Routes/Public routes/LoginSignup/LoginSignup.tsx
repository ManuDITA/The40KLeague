import React, { FC, useContext, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../../aws-exports';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { CognitoUserContext, isUserAuthenticatedContext } from '../../../../App';
import apiPaths from '../../../../../../apiList';
import { CognitoUser } from '../../../../../../classes/CognitoUser';

const LoginSignup: FC = () => {
  const navigate = useNavigate();
  const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext);
  const { cognitoUser, setCognitoUser } = useContext(CognitoUserContext)

  const [internalCognitoUser, setInternalCognitoUser] = useState<CognitoUser>({
    username: '',
    password: '',
    email: '',
    phone_number: '',
    name: '',
    birthdate: '',
  });

  const [confirmationCode, setConfirmationCode] = useState(''); // Added state for confirmation code
  const [isUserConfirmed, setIsUserConfirmed] = useState(true);
  const [errorMessage, setErrormessage] = useState('')
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  let tokenForApiRequest = '';

  const changeCognitoUserParams = (key: string, value: string) => {
    setInternalCognitoUser((prevUser) => ({
      ...prevUser,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const user = await Auth.signIn(internalCognitoUser.username, internalCognitoUser.password);
      console.log('User signed in:', user);
      // Handle successful login (update context, navigate, etc.)
      setIsUserAuthenticated(true);
      setCognitoUser(user)
      navigate('/dashboard');

    } catch (error) {
      console.error('Error signing in:', error);
      setErrormessage(error.message)
    }
  };

  const handleForgotPassword = async () => {
    try {
      const user = await Auth.forgotPassword(forgotPasswordEmail);
      console.log('Forgot password request sent:', user);
      setErrormessage('Forgot password request sent to' + user.codeDeliveryDetails.Destination)
      // Handle successful forgot password request (show success message, etc.)
    } catch (error) {
      console.error('Error sending forgot password request:', error.message);
      setErrormessage(error.message)
      // Handle forgot password request error (show error message, etc.)
    }

  }

  const registerUserToDatabase = (userToRegister) => {
    fetch(apiPaths.playersAPIEndpoint + apiPaths.player + apiPaths.createPlayer, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userToRegister),
    })
      .then(response => response.json())
      .then(data => {
        console.log('User added to the database, success:', data);
        // Handle the response data here
      })
      .catch(error => {
        console.error('User not added to the database, error:', error);
        // Handle errors here
      });
  }

  const handleConfirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(internalCognitoUser.username, confirmationCode);
      console.log('User confirmed');
      //now we can add the user to the player database
      registerUserToDatabase(internalCognitoUser);
      handleLogin()
    } catch (error) {
      console.error('Error confirming sign up:', error);
      // Handle confirmation error (show error message, etc.)
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await Auth.signUp({
        username: internalCognitoUser.username,
        password: internalCognitoUser.password,
        attributes: {
          email: internalCognitoUser.email,
          phone_number: internalCognitoUser.phone_number,
          name: internalCognitoUser.name,
          birthdate: internalCognitoUser.birthdate
        },
      });

      console.log('User signed up:', user);
      setIsUserRegistered(true)
      setIsUserConfirmed(false); // Set the state to false to show the confirmation code form
    } catch (error) {
      console.error('Error signing up:', error);
      setErrormessage(error.message)
      // Handle sign-up error (show error message, etc.)
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setIsUserAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle sign-out error (show error message, etc.)
    }
  };

  const [activeTab, setActiveTab] = useState('login');

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };


  return (
      <div className="mx-80 my-24 px-16 py-10 border-2 rounded-3xl border-black">
        {/* Tabs */}
        {isUserRegistered === false &&
          <div className="tabs">
            <div
              className={`tab ${activeTab === 'login' ? 'active-tab' : ''}`}
              onClick={() => switchTab('login')}
            >
              Login
            </div>
            <div
              className={`tab ${activeTab === 'signup' ? 'active-tab' : ''}`}
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </div>
          </div>
        }
        {/* Forms */}
        <div className="forms">
          <div className={`form ${activeTab === 'forgotPassword' ? 'active' : ''}`}>
            <label>Insert your account email:</label>
            <input type="email" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} />
            <button className='btn my-2 mx-auto' onClick={() => handleForgotPassword()}>Retrieve password</button>
            <div>{errorMessage}</div>
          </div>
          <div className={`form ${activeTab === 'login' ? 'active' : ''}`}>
            {/* Login Form */}

            <div>
              <label>Username:</label>
              <input type="text" value={internalCognitoUser.username} onChange={(e) => changeCognitoUserParams('username', e.target.value)} />
              <label>Password:</label>
              <input type="password" value={internalCognitoUser.password} onChange={(e) => changeCognitoUserParams('password', e.target.value)} />
            </div>
            <div className='container flex flex-row mx-auto my-3'>
              <button className='btn px-10' onClick={handleLogin}>Login</button>
              <button className='btn px-10' onClick={() => { switchTab('forgotPassword') }}>Forgot password</button>
            </div>
            <div>{errorMessage}</div>
          </div>
        </div>

        <div className={`form ${activeTab === 'signup' ? 'active' : ''}`}>
          {/* Signup Form */}
          {isUserRegistered === false &&
            <>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  required
                  value={internalCognitoUser.username}
                  onChange={(e) => changeCognitoUserParams('username', e.target.value)}
                />
                <label>Password:</label>
                <input
                  type="password"
                  required
                  value={internalCognitoUser.password}
                  onChange={(e) => changeCognitoUserParams('password', e.target.value)}
                />
                <label>Email:</label>
                <input
                  type="text"
                  required
                  value={internalCognitoUser.email}
                  onChange={(e) => changeCognitoUserParams('email', e.target.value)}
                />
                <label>Phone Number:</label>
                <input
                  type="text"
                  required
                  value={internalCognitoUser.phone_number}
                  onChange={(e) => changeCognitoUserParams('phone_number', e.target.value)}
                />
                <label>Name and Surname:</label>
                <input
                  type="text"
                  required
                  value={internalCognitoUser.name}
                  onChange={(e) => changeCognitoUserParams('name', e.target.value)}
                />
                <label>Birthdate:</label>
                <input
                  type="date"
                  required
                  value={internalCognitoUser.birthdate}
                  onChange={(e) => changeCognitoUserParams('birthdate', e.target.value)}
                />
              </div>
              <div className='container flex flex-row mx-auto my-3'>
                <button className='btn' onClick={handleSignUp}>Sign Up</button>
              </div>
              <div className='text-red-600'>{errorMessage}!</div>
            </>
          }
          {/* Confirmation Code Form, only showable when user has been registered */}
          {isUserConfirmed === false && (
            <>
              <h2>Confirm Sign Up</h2>
              <div>A confirmation code has been sent to: {internalCognitoUser.email}</div>
              <br></br>
              <label>Confirmation Code:</label>
              <input type="text" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
              <button className='btn my-2' onClick={handleConfirmSignUp}>Confirm Sign Up</button>
              <button className='btn' onClick={() => Auth.resendSignUp(internalCognitoUser.username)}>Resend Sign Up</button>
            </>
          )}

          {/* Logout Button */}
        </div>
      </div>
  );
};

export default LoginSignup;
