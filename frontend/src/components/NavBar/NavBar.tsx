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

  const customSignout = async () => {
    console.log("Signing out");
    await Auth.signOut();
    setIsUserAuthenticated(false);
    setToken("");
  };

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
            <Link to={"tournament/" + "nes1"  + "/" + 'session4'}>session4</Link>
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
          <Link to={'/dashboard'}><button className="dropbtn">Dashboard</button></Link>
        </div>

        {!isUserAuthenticated &&
          <div className="dropdown">
            <Link to={'/loginsignup'}><button className="dropbtn">Login/SignUp</button></Link>
          </div>}
        {isUserAuthenticated &&
          <div className="dropdown">
            <Link to={'/loginsignup'}><button className="dropbtn" onClick={customSignout}>Logout</button></Link>
          </div>}

      </div>
    </div>
  );
}

export default NavBar;
