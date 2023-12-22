import React, { FC, useContext, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../../aws-exports';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../App';

const LoginSignup: FC = () => {
  const navigate = useNavigate();
  const { setIsUserAuthenticated, setToken } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthDate] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(''); // Added state for confirmation code
  const [isUserConfirmed, setIsUserConfirmed] = useState(true);

  const handleLogin = async () => {
    try {
      const user = await Auth.signIn(username, password);
      console.log('User signed in:', user);
      // Handle successful login (update context, navigate, etc.)
      setIsUserAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle login error (show error message, etc.)
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log('User confirmed');
      //now we can add the user to the player database

      handleLogin()
    } catch (error) {
      console.error('Error confirming sign up:', error);
      // Handle confirmation error (show error message, etc.)
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          phone_number,
          name, // Match with 'name' in your Cognito user pool
          birthdate,  // Match with 'birthdate' in your Cognito user pool
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
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>

      {/* Signup Form */}
      <h2>Sign Up</h2>
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <label>Email:</label>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Phone Number:</label>
      <input type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>Date:</label>
      <input type="date" value={birthdate} onChange={(e) => setBirthDate(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>

      {/* Confirmation Code Form, only showable when user has been registered */}
      {isUserConfirmed === false && (
        <>
          <h2>Confirm Sign Up</h2>
          <label>Confirmation Code:</label>
          <input type="text" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
          <button onClick={handleConfirmSignUp}>Confirm Sign Up</button>
          <button onClick={() => Auth.resendSignUp(username)}>Resend Sign Up</button>
        </>
      )}

      {/* Logout Button */}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default LoginSignup;
