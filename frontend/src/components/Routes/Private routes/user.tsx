import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../../App";
import { Auth } from "aws-amplify";
import { UserClass } from "../../../../../classes/UserClass";

import './privateRoutes.css'
import { Session } from "../../../../../classes/Session";
import Banner from "../../Banner/Banner";
import { Match } from "../../../../../classes/match";
import apiPaths from "../../../../../apiList";
import { match } from "assert";

const User = () => {
    const { isUserAuthenticated, setIsUserAuthenticated, token, setToken } = useContext(UserContext)
    const [cognitoUser, setCognitoUser] = useState();
    const [matches, setMatches] = useState<Match[] | undefined>()


    useEffect(() => {
        console.log('is user authenticated: ', isUserAuthenticated)
        getUserInfo()
    }, [isUserAuthenticated])

    useEffect(() => {
        if (cognitoUser != undefined) {
            console.log('Logged user: ', cognitoUser)
            getUserMatches()
        }
    }, [cognitoUser])


    async function getUserInfo() {
        setCognitoUser(await Auth.currentUserPoolUser());

        const session = await Auth.currentSession();
        const receivedToken = session.getIdToken().getJwtToken();

        setToken(receivedToken)

    }

    async function getUserMatches() {
        console.log('fetching ' + apiPaths.playersAPIEndpoint + apiPaths.player + '/' + cognitoUser.username)
        console.log(token)
        await fetch(apiPaths.playersAPIEndpoint + apiPaths.player + '/' + cognitoUser.username, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        }
        ).then((res) => (res.json()))
            .then((output) => {
                console.log("Matches: ", output)
                setMatches(output)
            })
    }

    return (
        <div>
            <img src="/public/factions_backgrounds/Space Marines.jfif" className="userBackgroundImage"></img>
            <div className="boldWhite txtOverImage">
                {cognitoUser != undefined && cognitoUser.attributes.name} - {cognitoUser != undefined && cognitoUser.username}
            </div>

            <div className="containerUser title boldBlue">
                Matches waiting for approval:
            </div>

            <div style={{ whiteSpace: 'wrap', overflowX: 'auto' }}>
                {matches?.map((m: Match) => (
                    m.is_match_played==0 &&
                <Banner key={m.match_id} prop={m} canBeModified={true} />
                    
                ))}
            </div>

            <div className="containerUser title boldBlue">
                Past played matches:
            </div>

            <div style={{ whiteSpace: 'normal', overflowX: 'auto' }}>
                {matches?.map((m: Match) => (
                    m.is_match_played==1 &&
                <Banner key={m.match_id} prop={m} canBeModified={false} />
                    
                ))}
            </div>


        </div>
    )
}

export default User