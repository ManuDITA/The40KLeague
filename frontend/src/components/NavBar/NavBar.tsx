import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import pageLogo from '/logo.avif'
import { Session } from '../../../../classes/Session';
import { TournamentClass } from '../../../../classes/TournamentClass';
import { UserContext } from '../../App';

import { Auth } from 'aws-amplify';

interface NavBarProps { }

const NavBar: FC<NavBarProps> = () => {


  const { isUserAuthenticated, setIsUserAuthenticated, token, setToken } = useContext(UserContext);
  const [fetchedSessions, setFetchedSessions] = useState([]);

  useEffect(() => {

    fetch(`https://q6ut75iqab.execute-api.eu-west-3.amazonaws.com/dev/season/nes1/sessions`)
      .then((res) => res.json()) // Parse the response as JSON
      .then((data) => {
        setFetchedSessions(data); // Set the parsed data in your state or variable
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [])

  async function logout() {
    let ses = await Auth.signOut()
    setIsUserAuthenticated(false)

  }

  return (
    <div className="topnav">
      <div className="left-block">
        <Link to="/">
          <img src={pageLogo} alt="Logo" className="logo"></img>
        </Link>
      </div>
      <div className="right-block">
        <div className="dropdown">
          <Link to={'/tournament/nes1'}><button className="dropbtn">NES1</button></Link>
          <div className="dropdown-content">
            {
              //return <Link key={index} to={"tournament/" + "nes1"  + "/" + ses?.sessionID}>{ses?.seasonID} {ses?.sessionID}</Link>
            }
            <Link to={"tournament/" + "nes1"  + "/" + 'session1'}>session1</Link>
            <Link to={"tournament/" + "nes1"  + "/" + 'session2'}>session2</Link>
            <Link to={"tournament/" + "nes1"  + "/" + 'session3'}>session3</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Actualités</button>
          <div className="dropdown-content">
            <a href="#">NES1 session</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Qui sommes-nous</button>
          <div className="dropdown-content">
            <a href="#">Série</a>
            <a href="#">Partenaires</a>
            <a href="#">Social Responsability</a>
            <a href="#">Contactez-nous</a>
          </div>
        </div>

        <div className="dropdown">
          <Link to={'/dashboard'}><button className="dropbtn">User</button></Link>
        </div>

        {!isUserAuthenticated &&
          <div className="dropdown">
            <Link to={'/loginsignup'}><button className="dropbtn">Login/SignUp</button></Link>
          </div>}
        {isUserAuthenticated &&
          <div className="dropdown">
            <Link to={'/logout'}><button className="dropbtn" onClick={() => logout()}>Logout</button></Link>
          </div>}

      </div>
    </div>
  );
}

export default NavBar;
