import React, { FC, useEffect, useState } from 'react';
import './session.css'
import { Session } from '../../../../../../classes/Session';
import { Link, useParams } from 'react-router-dom';
import apiPaths from '../../../../../../apiList';

interface SessionPageProps { }

const SessionPage: FC<SessionPageProps> = () => {

  const { idSeason, idSessions } = useParams<{ idSeason: string; idSessions: string }>();
  const url = window.location.pathname;
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [players, setPlayers] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false)


  useEffect(() => {
    fetch(apiPaths.tournamentsAPIEndpoint + window.location.pathname)
      .then((res) => (res.json())) // Parse the response as JSON
      .then((data) => {
        //console.log(data); // Log the parsed JSON data
        console.log(data)
        setSession(data.session[0]); // Set the parsed data in your state or variable
        setPlayers(data.playerRanking.sort((a, b) => b.total_score - a.total_score))
        setIsPageLoaded(true)
        console.log(data.session[0].session_image_location)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [idSeason, idSessions]);

  return (
    <>
      {session == undefined ? (
        <div className='boldBlue'>LOADING</div>) : (

        <div className='container'>
          <div className='boldBlue'>
            {session?.is_session_active===1 ? (
              <>
                <span>{session?.tournament_id.toUpperCase()} - {session?.session_id.toUpperCase()} - EN COURS</span>
                <span className="video__icon">
                  <div className="circle--outer"></div>
                  <div className="circle--inner"></div>
                </span>
              </>

            ) : (
              <div>{session?.tournament_id.toUpperCase()} - {session?.session_id.toUpperCase()} - TERMINÉE</div>)}
          </div>
          <div className='sessionImageText'>
            <img src={session?.session_image_location} className='sessionImage'></img>
            <div className='sessionName'> {session?.session_name} </div>
          </div>
          <div className='boldBlue'>
            DERNIERS RÉSULTATS :
          </div>
          <div className='description'>
            Last Update : 12h00 - 26/10/2023
          </div>

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

          <div className='boldBlue'>CLASSEMENT</div>
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
                {players != undefined && players.map((p, index) => {
                  return (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{p.player_nickname}</td>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{p.total_score}</td>
                      <td>{}</td>
                    </tr>
                  )
                }
                )}

              </tbody>
            </table>
          </div>
        </div>


      )}
    </>)

}

export default SessionPage;