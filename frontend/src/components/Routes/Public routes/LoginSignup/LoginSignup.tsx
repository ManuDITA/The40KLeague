import React, { FC, useContext, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../../aws-exports';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../App';
import apiPaths from '../../../../../../apiList';
import { CognitoUser } from '../../../../../../classes/CognitoUser';

const LoginSignup: FC = () => {
  const navigate = useNavigate();
  const { setIsUserAuthenticated, setToken } = useContext(UserContext);

  const [cognitoUser, setCognitoUser] = useState<CognitoUser>({
    username: '',
    password: '',
    email: '',
    phone_number: '',
    name: '',
    birthdate: '',
  });

  const [confirmationCode, setConfirmationCode] = useState(''); // Added state for confirmation code
  const [isUserConfirmed, setIsUserConfirmed] = useState(true);

  const changeCognitoUserParams = (key: string, value: string) => {
    setCognitoUser((prevUser) => ({
      ...prevUser,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const user = await Auth.signIn(cognitoUser.username, cognitoUser.password);
      console.log('User signed in:', user);
      // Handle successful login (update context, navigate, etc.)
      setIsUserAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle login error (show error message, etc.)
    }
  };

  const registerUserToDatabase = (userToRegister) => {
    fetch(apiPaths.playersAPIEndpoint + apiPaths.player, {
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
      await Auth.confirmSignUp(cognitoUser.username, confirmationCode);
      console.log('User confirmed');
      //now we can add the user to the player database
      registerUserToDatabase(cognitoUser);
      handleLogin()
    } catch (error) {
      console.error('Error confirming sign up:', error);
      // Handle confirmation error (show error message, etc.)
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await Auth.signUp({
        username: cognitoUser.username,
        password: cognitoUser.password,
        attributes: {
          email: cognitoUser.email,
          phone_number: cognitoUser.phone_number,
          name: cognitoUser.name,
          birthdate: cognitoUser.birthdate,
        },
      });

      console.log('User signed up:', user);
      setIsUserConfirmed(false); // Set the state to false to show the confirmation code form
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle sign-up error (show error message, etc.)
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setIsUserAuthenticated(false);
      setToken('');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle sign-out error (show error message, etc.)
    }
  };

  return (
    <div>
      {/* Login Form */}
      <h2>Login</h2>
      <div>
        <label>Username:</label>
        <input type="text" value={cognitoUser.username} onChange={(e) => changeCognitoUserParams('username', e.target.value)} />
        <label>Password:</label>
        <input type="password" value={cognitoUser.password} onChange={(e) => changeCognitoUserParams('password', e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>

      {/* Signup Form */}
      <h2>Sign Up</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={cognitoUser.username}
          onChange={(e) => changeCognitoUserParams('username', e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={cognitoUser.password}
          onChange={(e) => changeCognitoUserParams('password', e.target.value)}
        />
        <label>Email:</label>
        <input
          type="text"
          value={cognitoUser.email}
          onChange={(e) => changeCognitoUserParams('email', e.target.value)}
        />
        <label>Phone Number:</label>
        <input
          type="text"
          value={cognitoUser.phone_number}
          onChange={(e) => changeCognitoUserParams('phone_number', e.target.value)}
        />
        <label>Name:</label>
        <input
          type="text"
          value={cognitoUser.name}
          onChange={(e) => changeCognitoUserParams('name', e.target.value)}
        />
        <label>Date:</label>
        <input
          type="date"
          value={cognitoUser.birthdate}
          onChange={(e) => changeCognitoUserParams('birthdate', e.target.value)}
        />
      </div>
      <button onClick={handleSignUp}>Sign Up</button>


      {/* Confirmation Code Form, only showable when user has been registered */}
      {isUserConfirmed === false && (
        <>
          <h2>Confirm Sign Up</h2>
          <label>Confirmation Code:</label>
          <input type="text" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
          <button onClick={handleConfirmSignUp}>Confirm Sign Up</button>
          <button onClick={() => Auth.resendSignUp(cognitoUser.username)}>Resend Sign Up</button>
        </>
      )}

      {/* Logout Button */}
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={registerUserToDatabase}>Registering trial</button>
    </div>
  );
};

export default LoginSignup;
