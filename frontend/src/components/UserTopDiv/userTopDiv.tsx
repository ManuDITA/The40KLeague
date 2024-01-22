import React, { useContext } from "react"
import { PieChart } from '@mui/x-charts/PieChart';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CognitoUserContext, isUserAuthenticatedContext } from "../../App";


const UserTopDiv = (props) => {

    const navigate = useNavigate();

    const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)
    const { cognitoUser, setCognitoUser } = useContext(CognitoUserContext)

    return (
        <>
            {cognitoUser != undefined && isUserAuthenticated == true &&
                <Link to={'/dashboard'} className=" top-0 pr-10 right-0 fixed flex flex-row items-center z-50">
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 1, value: 20, color: 'red' },
                                    { id: 2, value: 15, color: '#eeeeee' },
                                ],
                                innerRadius: 20,
                                outerRadius: 30,
                                cornerRadius: 0,
                                startAngle: 30,
                                endAngle: 330
                            },
                        ]}
                        width={80}
                        height={80}
                        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        slotProps={{ legend: { hidden: true } }}
                        colors={['red, transparent']}
                    />
                    <div className="text-xl font-black text-red-600">{cognitoUser.username}</div>
                </Link>
            }
            {isUserAuthenticated == false &&
                <div className="top-0 pr-10 right-0 fixed flex flex-row items-center z-50 bg-red-200">
                    Login
                </div>}
        </>
    )




};

export default UserTopDiv;
