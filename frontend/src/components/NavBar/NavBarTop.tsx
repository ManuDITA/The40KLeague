import React, { useContext } from "react"
import { Link } from "react-router-dom";
import { isUserAuthenticatedContext } from "../../App";

const NavBarTop = (props) => {


    const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)

    return (
        isUserAuthenticated === true &&
            < nav className="fixed mx-auto text-red-500 font-medium w-screen z-50 h-16  border-b-black pr-24" >
                <div className="flex xl:flex-row xl:items-center h-full xl:overflow-hidden justify-center">
                    <Link to={'/dashboard'} className='hover:underline hover:underline-offset-8 items-center px-4'>
                        <div className='text-6xl xl:text-3xl'>
                            <span className="">Dashboard</span>
                        </div>
                    </Link>

                    <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 items-center px-4'>
                        <div className='text-6xl xl:text-3xl'>
                            <span className="">Play</span>
                        </div>
                    </Link>

                    <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 items-center px-4'>
                        <div className='text-6xl xl:text-3xl'>
                            <span className="">Create</span>
                        </div>
                    </Link>

                    <Link to={'/tournaments'} className='hover:underline hover:underline-offset-8 items-center px-4'>
                        <div className='text-6xl xl:text-3xl'>
                            <span className="">Team</span>
                        </div>
                    </Link>

                    <Link to={'/mylists'} className='hover:underline hover:underline-offset-8 items-center px-4'>
                        <div className='text-6xl xl:text-3xl'>
                            <span className="">Lists</span>
                        </div>
                    </Link>

                </div>
            </nav >
    )
    
};

export default NavBarTop;
