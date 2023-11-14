import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../../App";
import { Auth } from "aws-amplify";
import { UserClass } from "../../../classes/UserClass";

import './privateRoutes.css'
import { Session } from "../../../classes/Session";

const User = () => {

    const { isUserAuthenticated, setIsUserAuthenticated, token, setToken } = useContext(UserContext)
    const [user, setUser] = useState(new UserClass);
    const [session, setSession] = useState(new Session)
    let myUser

    useEffect(() => {
        console.log(isUserAuthenticated)
        console.log(token)
        getUserInfo()
    }, [isUserAuthenticated, token])


    async function getUserInfo() {

        const cognitoUserID = Auth.Credentials.Auth.user.attributes.sub;
        myUser = Auth.Credentials.Auth.user?.attributes
        console.log(Auth.Credentials.Auth)
        await fetch(`https://iw5168sfve.execute-api.eu-west-3.amazonaws.com/dev/user/${myUser.nickname}?cognitoUserID=${cognitoUserID}`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        }
        ).then((res) => (res.json()))
            .then((output) => {
                console.log(output)
                setUser(output.user)
                setSession(output.session[0])
            })
    }

    return (
        <div>
            <div className="title boldBlue">
                User:
                {user != undefined && <div>{user.nickname} {user.army}</div>}
            </div>

            <div className="title boldBlue">
                My matches:

            </div>
            {session != undefined && session.sessionTable?.map((row, index) => {
                if (row.Nickname === "Tarkhan")
                    return <div>{JSON.stringify(row)}</div>
            })}

        </div>
    )
}

export default User