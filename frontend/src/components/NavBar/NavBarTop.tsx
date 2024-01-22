import React, { useContext } from "react"
import { BsCalendarDate } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiPodiumWinner } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdWorkspacePremium } from "react-icons/md";
import { Link } from "react-router-dom";
import { isUserAuthenticatedContext } from "../../App";

const NavBarTop = (props) => {


    const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)

    return (
        <nav className=" fixed mx-auto text-red-500 font-medium w-full z-50 h-16 pr-24">
            <div className="flex xl:flex-row xl:items-center h-full xl:overflow-hidden justify-evenly px-44">
                <Link to={'/dashboard'} className='hover:underline hover:underline-offset-8 items-center'>
                    <div className='text-6xl xl:text-3xl'>
                        <span className="">Dashboard</span>
                    </div>
                </Link>

                <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 items-center  '>
                    <div className='text-6xl xl:text-3xl'>
                        <span className="">Play</span>
                    </div>
                </Link>

                <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 items-center '>
                    <div className='text-6xl xl:text-3xl'>
                        <span className="">Create</span>
                    </div>
                </Link>

                <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 items-center '>
                    <div className='text-6xl xl:text-3xl'>
                        <span className="">Team</span>
                    </div>
                </Link>

                <Link to={'/mylists'} className='hover:underline hover:underline-offset-8 items-center'>
                    <div className='text-6xl xl:text-3xl'>
                        <span className="">Lists</span>
                    </div>
                </Link>


                {isUserAuthenticated ?
                    <div className='text-6xl xl:text-3xl'>
                        <Link to={'/loginSignup'}>
                            <span className="">Login</span>
                        </Link>

                    </div>
                    :
                    <div className='text-6xl xl:text-3xl'>
                        <Link to={'/logout'}>
                            <span className="">Logout</span>
                        </Link>
                    </div>
                }


            </div>
        </nav >
    )
};

export default NavBarTop;
