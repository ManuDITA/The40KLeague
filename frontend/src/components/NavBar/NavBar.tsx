import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import pageLogo from '/Flag_of_Switzerland.png'
import { Session } from '../../../../classes/Session';
import { TournamentClass } from '../../../../classes/TournamentClass';
import './navbar.css'

import { IoSettingsOutline } from "react-icons/io5";
import { MdWorkspacePremium } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { GiPodiumWinner } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { GoStarFill } from "react-icons/go";


/*          <div>
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
          */

import { Auth } from 'aws-amplify';
import { CognitoUserContext, isUserAuthenticatedContext } from '../../App';

interface NavBarProps { }

const NavBar: FC<NavBarProps> = () => {

  
  const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)
  const { cognitoUser, setCognitoUser } = useContext(CognitoUserContext)

  const customSignout = async () => {
    console.log("Signing out");
    await Auth.signOut();
    setIsUserAuthenticated(false)
  };

  return (
    <nav className="bg-customBlue text-white z-50 xl:left-0 fixed xl:h-full xl:overflow-y-hidden xl:w-24 w-full bottom-0">
      <div className="flex xl:flex-col xl:items-center justify-between xl:h-full xl:overflow-hidden flex-row">
        <Link to={'/'} className="w-20 hidden font-bold xl:flex xl:flex-col justify-evenly h-1/5">
          <img src={pageLogo} alt="logo" className="w-24" />
        </Link>

        <div className="font-bold xl:flex-col flex flex-row xl:justify-center justify-evenly items-center w-full xl:h-3/5 min-h-32">

          <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 flex flex-col items-center py-4 px-2 border-l-0'>
            <div className='text-6xl xl:text-3xl'>
              <BsCalendarDate />
            </div>
            <span className="font-light text-sm hidden xl:inline">Upcoming</span>
          </Link>

          <Link to={'/nes1'} className='hover:underline hover:underline-offset-8 flex flex-col items-center py-4 px-2 border-l-0'>
            <div className='text-6xl xl:text-3xl'>
              <GiPodiumWinner />
            </div>
            <span className="font-light text-sm hidden xl:inline">Ranking</span>
          </Link>

          <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 flex flex-col items-center py-4 px-2 border-l-0'>
            <div className='text-6xl xl:text-3xl'>
              <FaSearch />
            </div>
            <span className="font-light text-sm hidden xl:inline">Search</span>
          </Link>

          <Link to={'/nes1'} className='hover:underline hover:underline-offset-8 flex flex-col items-center py-4 px-2 border-l-0'>
            <div className='text-6xl xl:text-3xl'>
              <FaMapLocationDot />
            </div>
            <span className="font-light text-sm hidden xl:inline">Map</span>
          </Link>
        </div>



        <div className="hidden font-bold  xl:flex xl:flex-col  xl:justify-center xl:h-1/5">
          <Link to={'/nes1'} className='hover:underline hover:underline-offset-8 flex flex-col py-4 items-center'>
            <div className='text-6xl xl:text-3xl flex items-center'>
              <IoSettingsOutline />
            </div>
            <span className="font-light text-sm">Settings</span>
          </Link>

          <button onClick={() => customSignout()} className='hover:underline hover:underline-offset-8 flex flex-col py-4 items-center'>
            <div className='text-6xl xl:text-3xl flex items-center'>
              <MdWorkspacePremium />
            </div>
            <span className="font-light text-sm">Logout</span>
          </button>
        </div>


      </div>
    </nav>


  );
}

export default NavBar;
