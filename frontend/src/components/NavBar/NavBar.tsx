import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import pageLogo from '/logo.avif'
import { Session } from '../../../../classes/Session';
import { TournamentClass } from '../../../../classes/TournamentClass';
import { UserContext } from '../../App';
import './navbar.css'

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
    <div className="navbar">
      <div className="containerNavbar flexNavbar">
        <div className='containerLinks'>
          <Link to="/">
            <img src={pageLogo} alt="Logo" className="logo"></img>
          </Link>
        </div>
        <div className='containerLinks '>
          <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={'/tournament/nes1'} className='singleLinkNavbar dropdown'>
            <div>
              NES1
            </div>
            <div className="dropdown-content">
              <Link to={'/tournament/nes1/session1'}>
                Session 1
              </Link>
              <Link to={'/tournament/nes1/session2'}>
                Session 2
              </Link>
              <Link to={'/tournament/nes1/session3'}>
                Session 3
              </Link>
              <Link to={'/tournament/nes1/session4'}>
                Session 4
              </Link>
            </div>
          </Link>
          <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={'/tournaments'} className='singleLinkNavbar'>
            <div >
              Tournaments
            </div>
          </Link>
          <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={'/tournament/nes1'} className='singleLinkNavbar'>
            <div >
              Actualites
            </div>
          </Link>
          <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={'/tournament/nes1'} className='singleLinkNavbar'>
            <div >
              Qui sommes-nous
            </div>
          </Link>
          <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={'/dashboard'} className='singleLinkNavbar'>
            <div >
              Dashboard
            </div>
          </Link>
          <div >
            {!isUserAuthenticated &&
              <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={'/loginsignup'} className='singleLinkNavbar'>
                <div className='singleLinkNavbar'>
                  Login/SignUp
                </div>
              </Link>
            }
            {isUserAuthenticated &&

              <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={'/'} className='singleLinkNavbar'>
                <div className='singleLinkNavbar' onClick={customSignout}>
                  Logout
                </div>
              </Link>


            }
          </div>
        </div>
      </div>
    </div>


  );
}

export default NavBar;
