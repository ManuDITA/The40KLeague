import React, { FC, useEffect, useState } from 'react';
import './session.css'
import { Session } from '../../../../classes/Session';
import { Link, useParams } from 'react-router-dom';

interface SessionPageProps { }

const SessionPage: FC<SessionPageProps> = () => {

  const { idSeason, idSessions } = useParams<{ idSeason: string; idSessions: string }>();
  const url = window.location.pathname;
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [isPageLoaded, setIsPageLoaded] = useState(false)


  useEffect(() => {
    // Function will retrigger on URL change
    console.log(url)
    fetch(`https://q6ut75iqab.execute-api.eu-west-3.amazonaws.com/dev${window.location.pathname}`)
      .then((res) => (res.json())) // Parse the response as JSON
      .then((data) => {
        //console.log(data); // Log the parsed JSON data
        setSession(data); // Set the parsed data in your state or variable
        setIsPageLoaded(true)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [idSeason, idSessions]);

  return (
    <>
      {session == undefined ? (
        <div className='boldBlue'> LOADING</div>) : (

        <div className='container'>
          <div className='boldBlue'>
            {session?.isSessionOngoing==="true" ? (
              <>
                <span>{session?.seasonID.toUpperCase()} - {session?.sessionID.toUpperCase()} - EN COURS</span>
                <span className="video__icon">
                  <div className="circle--outer"></div>
                  <div className="circle--inner"></div>
                </span>
              </>

            ) : (
              <div>{session?.seasonID?.toUpperCase()} - {session?.sessionID?.toUpperCase()} - TERMINÉE</div>)}
          </div>
          <div className='sessionImageText'>
            <img src={session?.sessionImageLocation} className='sessionImage'></img>
            <div className='sessionName'> {session?.sessionName} </div>
          </div>
          <div className='boldBlue'>
            DERNIERS RÉSULTATS :
          </div>
          <div className='description'>
            Last Update : 12h00 - 26/10/2023
          </div>

          <Link to='/season/nes1'>
            <img className='seasonImage' src="/session/pairings-image.avif" />
          </Link>
          <Link to='/season/nes1'>
            <img className='seasonImage' src="/session/allgames-image.avif" />
          </Link>
          <Link to='/season/nes1'>
            <img className='seasonImage' src="/session/sportmanship-image.avif" />
          </Link>
          <Link to='/season/nes1'>
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
                {session?.playerRanking != undefined && session?.playerRanking.map((p, index) => {
                  let player = p.split(",")
                  return (
                    <tr key={index}>
                      <td>{player[0]}</td>
                      <td>{player[1]}</td>
                      <td>{player[2]}</td>
                      <td>{player[3]}</td>
                      <td>{player[4]}</td>
                      <td>{player[5]}</td>
                      <td>{player[6]}</td>
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