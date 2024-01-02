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
    <nav className="bg-customBlue p-2 px-6 text-white top-0 w-full z-50">
      <div className="flex mx-8 items-center justify-between">
        <Link to={''} className="pt-2">
          <img src={pageLogo} alt="logo" className="w-60" />
        </Link>

        <div className="hidden font-bold md:flex space-x-6">
          <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8'>
            Tournaments
          </Link>
          <Link to={'/nes1'} className='hover:underline hover:underline-offset-8'>
            Matches
          </Link>
          <Link to={'/'} className='hover:underline hover:underline-offset-8'>
            About Us
          </Link>
          <Link to={'/dashboard'} className='hover:underline hover:underline-offset-8'>
            Dashboard
          </Link>
          <div >
            {!isUserAuthenticated &&
              <Link to={'/loginsignup'} className='hover:underline hover:underline-offset-8'>
                Login/SignUp
              </Link>
            }
            {isUserAuthenticated &&

              <Link to={'/'} className='hover:underline hover:underline-offset-8'>
                <div onClick={customSignout}>
                  Logout
                </div>
              </Link>


            }
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
