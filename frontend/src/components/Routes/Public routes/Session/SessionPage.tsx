import React, { FC, useEffect, useState } from 'react';
import './session.css'
import { Session } from '../../../../../../classes/Session';
import { Link, useParams } from 'react-router-dom';
import apiPaths from '../../../../../../apiList';

import { Match } from '../../../../../../classes/match';
import Banner from '../../../Banner/Banner';
import { Player } from '../../../../../../classes/Player';

interface SessionPageProps { }

const SessionPage: FC<SessionPageProps> = () => {

  const { idSeason, idSessions } = useParams<{ idSeason: string; idSessions: string }>();
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [players, setPlayers] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  const [matchesInSession, setMatchesInSession] = useState([]);

  const url = window.location.pathname.split('/').pop();

  //triggering on url change for new api call
  useEffect(() => {
    getSessionInfo()
    getMatchesInSession()
  }, [url]);



  const getSessionInfo = () => {
    fetch(apiPaths.tournamentsAPIEndpoint + window.location.pathname)
      .then((res) => (res.json())) // Parse the response as JSON
      .then((data) => {
        console.log(data)
        setSession(data.session[0]); // Set the parsed data in your state or variable
        setPlayers(data.playerRanking.sort((a, b) => b.total_score - a.total_score))
        setIsPageLoaded(true)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const getMatchesInSession = () => {
    fetch(apiPaths.tournamentsAPIEndpoint + window.location.pathname + '/getMatchesInSession')
      .then((res) => (res.json())) // Parse the response as JSON
      .then((data) => {
        //console.log(data); // Log the parsed JSON data
        console.log(data)
        setMatchesInSession(data.matches)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Filter and sort the most recent 4 matches
  const mostRecentMatches = matchesInSession
    .sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
    .slice(0, 4);

  return (
    <>
      {session == undefined ? (

        <div className='green40k my-5'>LOADING</div>) : (
        <>
          <div className="container flex flex-col items-center mx-auto">
            <div className='green40k my-2'>
              {session?.is_session_active === 1 ? (
                <div>
                  <span>{session?.tournament_id.toUpperCase()} - {session?.session_id.toUpperCase()} - EN COURS</span>
                  <span className="video__icon">
                    <div className="circle--outer"></div>
                    <div className="circle--inner"></div>
                  </span>
                </div>

              ) :
                (
                  <div>{session?.tournament_id.toUpperCase()} - {session?.session_id.toUpperCase()} - TERMINÉE</div>)}
            </div>
            <img
              src={session?.session_image_location || "/factions_backgrounds/Aeldari.png"}
              onError={({ currentTarget }) => {
                console.log(currentTarget)
                currentTarget.onerror = null; // prevents looping
                currentTarget.src="/factions_backgrounds/Aeldari.png";
              }}
              className='w-full h-80 object-cover'
            />
            <div className='sessionName'> {session?.session_name} </div>
          </div>

          <div className='green40k'>
            DERNIERS RÉSULTATS :
          </div>
          <div className='flex flex-row justify-start overflow-scroll xl:justify-center xl:overflow-visible xl:flex-wrap overflow-y-hidden'>
            {mostRecentMatches.map((m: Match) => (
              <Link to={'/match/' + m.match_id} className='mx-5'>
                <Banner key={m.match_id} prop={m} canBeModified={false} />
              </Link>
            ))}
          </div>

          <br></br>


          <div className='container flex flex-row mx-auto items-center justify-around p-10'>
            <Link to='/tournament/nes1'>
              <img className='seasonImage' src="/session/pairings-image.avif" />
            </Link>
            <Link to='/tournament/nes1'>
              <img className='seasonImage' src="/session/allgames-image.avif" />
            </Link>
            <Link to='/tournament/nes1'>
              <img className='seasonImage' src="/session/sportmanship-image.avif" />
            </Link>
            <Link to='/tournament/nes1'>
              <img className='seasonImage' src="/session/seasonranking-image.avif" />
            </Link>
          </div>

          <div className='green40k'>CLASSEMENT</div>
          <div className='myTableContainer'>
            <table>
              <thead>
                <tr className='tableRow'>
                  <th>RANK</th>
                  <th>NICKNAME</th>
                  <th>FACTION</th>
                  <th>LISTS</th>
                  <th>SMP</th>
                  <th>PTL</th>
                  <th>LAST 3 GAMES</th>
                </tr>
              </thead>
              <tbody>
                {players != undefined && players.map((p: Player, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{p.player_nickname}</td>
                      <td style={{ textAlign: 'center' }}><img src={"../../../public/factions/" + `${p.favourite_army}.png`} style={{ height: '70px' }}></img></td>
                      <td>{ }</td>
                      <td>{ }</td>
                      <td>{p.total_score}</td>
                      <td>{ }</td>
                    </tr>
                  )
                }
                )}

              </tbody>
            </table>
          </div>
        </>


      )}
    </>
  )

}

export default SessionPage;