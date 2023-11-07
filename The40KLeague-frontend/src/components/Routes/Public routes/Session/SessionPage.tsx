import React, { FC, useEffect, useState } from 'react';
import './session.css'
import { Session } from '../../../../classes/Session';

interface SessionPageProps { }

const SessionPage: FC<SessionPageProps> = () => {


  const url = window.location.pathname.split('/').pop();
  const [session, setSession] = useState(new Session());
  const [sessionState, setSessionState] = useState('');
  const [isPageLoaded, setIsPageLoaded] = useState(false)


  useEffect(() => {
    // Function will retrigger on URL change
    fetch(`http://localhost:3000${window.location.pathname}`)
      .then((res) => (res.json())) // Parse the response as JSON
      .then((data) => {
        console.log(data); // Log the parsed JSON data
        setIsPageLoaded(true)
        setSession(data); // Set the parsed data in your state or variable
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [url]);

  useEffect(() => {

  }, [])

  return (
    <>
      {isPageLoaded === false ? (
        <div className='boldBlue'> LOADING</div>) : (
        <div>
          <div className='container'>
            <div className='boldBlue'>
              {session?.isSessionOngoing ? (
                <>
                  <span>{session?.sessionPrefix}{session?.sessionPostfix} - EN COURS</span>
                  <span className="video__icon">
                    <div className="circle--outer"></div>
                    <div className="circle--inner"></div>
                  </span>
                </>

              ) : (
                <div>{session?.sessionPrefix}{session?.sessionPostfix} - TERMINÉE</div>)}
            </div>
            <div className='sessionImageText'>
              <img src={'src/assets/' + session?.sessionImage} className='sessionImage'></img>
              <div className='sessionName'> {session?.sessionName} </div>
            </div>
            <div className='boldBlue'>
              DERNIERS RÉSULTATS :
            </div>
            <div className='description'>
              Last Update : 12h00 - 26/10/2023
            </div>

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
                  {session.players!= undefined && session.players.map((player) =>
                    <tr>
                      <td>{player.Rank}</td>
                      <td>{player.Nickname}</td>
                      <td>{player.Faction}</td>
                      <td>{player.smp}</td>
                      <td>{player.ptl}</td>
                      <td>{player.last3games}</td>
                    </tr>

                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div>)}
    </>)

}

export default SessionPage;