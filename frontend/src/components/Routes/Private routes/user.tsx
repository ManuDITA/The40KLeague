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
import { Link } from "react-router-dom";

import { IoHome } from "react-icons/io5";

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
            <img src="/public/factions_backgrounds/Orks.jpg" className="overflow-hidden brightness-30 bg-cover bg-no-repeat w-screen max-h-screen object-cover object-top"></img>
            <div className="absolute flex flex-col mx-auto items-center xl:flex-row top-32 left-0 right-0 px-32">
                <section className="container flex mx-auto flex-row flex-nowrap items-center justify-center py-10 xl:justify-start">
                    <img src="./user.png" className="w-1/6 h-1/4 rounded-full"></img>
                    <section className=" flex flex-col text-left ">
                        <div className="text-red-600 text-8xl font-sans font-medium italic">{cognitoUser != undefined && cognitoUser.username.toUpperCase()}</div>
                        <div className="flex items-center text-gray-50 text-3xl font-bold whitespace-nowrap">{cognitoUser != undefined && cognitoUser.attributes.name},&emsp;<IoHome /> Italy</div>
                    </section>

                </section>

                <section className="text-blue-50 w-full justify-end">
                    <div className="text-center text-4xl text-blue-50 font-bold p-10">
                        Battle stats
                    </div>
                    <table className="table-auto w-full border-collapse">
                        <tr>
                            <td className="text-left  text-blue-50 px-10 py-2 text-2xl border-y-0 font-medium">
                                Winrate
                            </td>
                            <td className="text-right text-green-500 text-2xl border-y-0 font-medium">
                                60%
                            </td>
                        </tr>
                        <tr className="">
                            <td className="text-left text-blue-50 px-10 py-2 text-2xl border-y-0 font-medium">
                                Played games
                            </td>
                            <td className="text-right text-green-500 text-2xl border-y-0 font-medium">
                                12
                            </td>
                        </tr>
                        <tr className="">
                            <td className="text-left text-blue-50 px-10 py-2 text-2xl border-y-0 font-medium">
                                Played tournaments
                            </td>
                            <td className="text-right text-green-500 text-2xl border-y-0 font-medium">
                                2
                            </td>
                        </tr>
                        <tr className="">
                            <td className="text-left text-blue-50 px-10 py-2 text-2xl border-y-0 font-medium">
                                Average points per game
                            </td>
                            <td className="text-right text-green-500 text-2xl border-y-0 font-medium">
                                10.3
                            </td>
                        </tr>
                    </table>
                </section>


            </div>

            <div className="containerUser title boldBlue">
                Matches waiting for approval:
            </div>

            <div className="container flex flex-wrap items-center my-10 mx-auto">
                {matches?.map((m: Match) => (
                    m.is_match_played == 0 &&
                    <Banner key={m.match_id} prop={m} canBeModified={true} />

                ))}
            </div>

            <div className="containerUser title boldBlue">
                Past played matches:
            </div>

            <div className="container flex flex-row flex-wrap items-center mx-auto">
                {matches?.map((m: Match) => (
                    m.is_match_played == 1 &&
                    <Link to={'/match/' + m.match_id} className='mx-5'>
                        <Banner key={m.match_id} prop={m} canBeModified={false} />
                    </Link>
                ))}
            </div>


        </div>
    )
}

export default User