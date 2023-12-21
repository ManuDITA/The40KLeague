import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../../App";
import { Auth } from "aws-amplify";
import { UserClass } from "../../../../../classes/UserClass";

import './privateRoutes.css'
import { Session } from "../../../../../classes/Session";
import Banner from "../../Banner/Banner";
import { Match } from "../../../../../classes/match";

const User = () => {
    const { isUserAuthenticated, setIsUserAuthenticated, token, setToken } = useContext(UserContext)
    const [user, setUser] = useState(new UserClass);
    const [matches, setMatches] = useState<Match[] | undefined>()
    const [loggedProfile, setLoggedProfile] = useState()

    let receivedSession;


    useEffect(() => {
        getUserInfo()
    }, [isUserAuthenticated, token])

    useEffect(() => {
        console.log(window.location.pathname)
    }, [])

    useEffect(() => {
        if (loggedProfile != undefined) {
            console.log("profile:", loggedProfile)
            getUserMatches()
        }
    }, [loggedProfile])

    async function getUserInfo() {
        const cognitoUserID = Auth.Credentials.Auth.user?.attributes?.sub;
        const nicknameForRequest = Auth.Credentials.Auth.user?.attributes?.nickname;
        console.log(nicknameForRequest, cognitoUserID)
        await fetch(`https://iw5168sfve.execute-api.eu-west-3.amazonaws.com/dev/user/${nicknameForRequest}?cognitoUserID=${cognitoUserID}`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        }
        ).then((res) => (res.json()))
            .then((output) => {
                console.log("API call: ", output)

                receivedSession = output.session[0]
                console.log("Session: ", receivedSession)
                getUserMatches(receivedSession, Auth.Credentials.Auth.user?.attributes.nickname)
                setUser(output.user)
                setLoggedProfile(Auth.Credentials.Auth.user?.attributes)
            })
    }

    function getUserMatches(session, nickname) {
        console.log(session)
        session?.sessionTable?.map((row, index) => {
            console.log(row.Nickname.toLowerCase())
            if (row.Nickname.toLowerCase() === nickname.toLowerCase()) {
                console.log("found")
                let status;
                if (row["Att/Def1"] == "A")
                    status = true;
                else
                    status = false

                setMatches([
                    //match 1
                    new Match(row.Nickname, row.Game1_Opp, row["Att/Def1"] == "A", row["GameSetup Code 1"], row["Game1 Pairing Factions"].split(" - ")[0], row["Game1 Pairing Factions"].split(" - ")[1], ". - .", row["Game1"], row["Game1_Day"], row["Nickname"]),
                    //match 2
                    new Match(row.Nickname, row.Game2_Opp, row["Att/Def2"] == "A", row["GameSetup Code 2"], row["Game2 Pairing Factions"].split(" - ")[0], row["Game2 Pairing Factions"].split(" - ")[1], ". - .", row["Game2"], row["Game2_Day"], row["Nickname"]),
                    //match 3
                    new Match(row.Nickname, row.Game3_Opp, row["Att/Def3"] == "A", row["GameSetup Code 3"], row["Game2 Pairing Factions"].split(" - ")[0], row["Game3 Pairing Factions"].split(" - ")[1], ". - .", row["Game3"], row["Game3_Day"], row["Nickname"])
                ])

            }
        })
    }

    return (
        <div>
            <img src="/public/factions_backgrounds/Space Marines.jfif" className="userBackgroundImage"></img>
            <div className="boldWhite txtOverImage">
                {user != undefined && <div>{user.nickname} - {user.army}</div>}
            </div>

            <div className="containerUser title boldBlue">
                This session matches:
            </div>

            {matches != undefined &&
                <div className="containerUser">
                    <Banner prop={matches[0]}></Banner>
                    <Banner prop={matches[1]}></Banner>
                    <Banner prop={matches[2]}></Banner>
                </div>
            }

        </div>
    )
}

export default User