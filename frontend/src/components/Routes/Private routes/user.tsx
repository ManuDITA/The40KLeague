import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext, useEffect, useState } from "react";

import { CognitoUserContext, isUserAuthenticatedContext } from "../../../App";
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
import { Player } from "../../../../../classes/Player";
import ThreeJsComponent from "../../3D Viewer/3dviewer";
import MyLists from "./mylists";
import { TournamentClass } from "../../../../../classes/TournamentClass";


const User = () => {
    const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)
    const {cognitoUser, setCognitoUser} = useContext(CognitoUserContext)


    //const [cognitoUser, setCognitoUser] = useState();
    const [player, setPlayer] = useState<Player>()
    const [player_id, setPlayer_id] = useState<number | undefined>()
    const [matches, setMatches] = useState<Match[] | undefined>()
    const [enrolledTournaments, setEnrolledTournaments] = useState()


    useEffect(() => {
        if (cognitoUser != undefined) {
            //getUserEnrolledTournaments()
            getUserId()
            getUserMatches()
        }
    }, [cognitoUser])

    async function getUserId() {
        console.log('fetching user id')
        fetch(apiPaths.playersAPIEndpoint + apiPaths.player + "/" + cognitoUser.username + '/id', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => (res.json()))
            .then((id) => {
                console.log("User id: ", id[0].player_id)
                setPlayer_id(id[0].player_id)
            })
    }

    async function getUserMatches() {
        console.log('fetching ' + apiPaths.player + '/' + cognitoUser.username)
        await fetch(apiPaths.playersAPIEndpoint + apiPaths.player + '/' + cognitoUser.username, {
            method: 'GET',
            headers: {
                'Authorization': cognitoUser.signInUserSession.idToken.jwtToken
            }
        }
        ).then((res) => (res.json()))
            .then((output) => {
                console.log("Output: ", output)
                let p: Player = {
                    //FIXME: Change this ugly way for which we get the player_id nickname and favourite army
                    player_id: player_id || undefined,
                    player_nickname: cognitoUser.username,
                    favourite_army: 'Orks'
                }
                console.log(p)
                setPlayer(p)
                setMatches(output.matches)
                setEnrolledTournaments(output.tournaments)
            })
    }

    async function getUserEnrolledTournaments() {
        console.log('fetching ' + apiPaths.playersAPIEndpoint + apiPaths.player + '/' + cognitoUser.username + apiPaths.getPlayerEnrolledTournaments)
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
        <>
            {cognitoUser && player !== undefined && enrolledTournaments !== undefined &&
                <div>
                    <img src={`/public/factions_backgrounds/${player.favourite_army}.png`} className="overflow-hidden brightness-30 bg-cover bg-no-repeat w-screen max-h-screen object-cover object-top"></img>
                    <div className="absolute flex flex-col mx-auto items-center xl:flex-row top-32 left-0 right-0 px-32">
                        <section className="container flex mx-auto flex-row flex-nowrap items-center justify-center py-10 xl:justify-start">
                            <img src="./user.png" className="w-1/6 h-1/4 rounded-full"></img>
                            <section className="flex flex-col text-left">
                                <div className="flex items-center">
                                    <div className="text-red-600 text-8xl font-sans font-medium italic">
                                        {cognitoUser !== undefined && cognitoUser.username.toUpperCase()}
                                    </div>
                                    {player !== undefined && (
                                        <img
                                            className="invert ml-4 h-20"
                                            src={`/factions/${player.favourite_army}.png`}
                                            alt={`${player.favourite_army} faction`}
                                        />
                                    )}
                                </div>
                                <div className="flex items-center text-gray-50 text-3xl font-bold whitespace-nowrap">
                                    {cognitoUser !== undefined && cognitoUser.attributes.name},&emsp;
                                    <IoHome /> Italy
                                </div>
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
                                    <td className="text-right text-red-600 text-2xl border-y-0 font-medium">
                                        60%
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="text-left text-blue-50 px-10 py-2 text-2xl border-y-0 font-medium">
                                        Played games
                                    </td>
                                    <td className="text-right text-red-600 text-2xl border-y-0 font-medium">
                                        {matches?.length}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="text-left text-blue-50 px-10 py-2 text-2xl border-y-0 font-medium">
                                        Played tournaments
                                    </td>
                                    <td className="text-right text-red-600 text-2xl border-y-0 font-medium">
                                        {enrolledTournaments?.length}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="text-left text-blue-50 px-10 py-2 text-2xl border-y-0 font-medium">
                                        Average points per game
                                    </td>
                                    <td className="text-right text-red-600 text-2xl border-y-0 font-medium">
                                        10.3
                                    </td>
                                </tr>
                            </table>
                        </section>



                    </div>


                    <div className="containerUser title green40k">
                        Enrolled tournaments:
                    </div>

                    <div className="container flex flex-wrap items-center my-10 mx-auto bg-slate-400">
                        {enrolledTournaments?.map((tournament: TournamentClass) => (
                            <div key={tournament.tournament_id}>
                                <Link to={'/tournament/' + tournament.tournament_id}>
                                    {tournament.tournament_id} -
                                    {tournament.max_player_count}
                                </Link>
                            </div>
                        ))}
                    </div>


                    <div className="containerUser title green40k">
                        Matches waiting for approval:
                    </div>

                    <div className="container flex flex-wrap items-center my-10 mx-auto">
                        {matches?.map((m: Match) => (
                            m.is_match_played == 0 &&
                            <Banner key={m.match_id} prop={m} canBeModified={true} />

                        ))}
                    </div>

                    <div className="containerUser title green40k">
                        Past played matches:
                    </div>

                    <div className="container flex flex-row flex-wrap items-center mx-auto">
                        {matches?.map((m: Match) => (
                            m.is_match_played == 1 &&
                            <Link to={'/match/' + m.match_id} className='mx-5' key={m.match_id}>
                                <Banner key={m.match_id} prop={m} canBeModified={false} />
                            </Link>
                        ))}
                    </div>


                </div>
            }
        </>
    )
}

export default User