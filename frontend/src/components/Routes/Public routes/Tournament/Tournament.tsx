import React, { FC, useEffect, useState } from 'react';
import './Tournament.css'
import { Session } from '../../../../../../classes/Session';
import { Link } from 'react-router-dom';
import { TournamentClass } from '../../../../../../classes/TournamentClass';
import apiPaths from '../../../../../../apiList';
import { Player } from '../../../../../../classes/Player';

interface TournamentProps { }

const Tournament: FC<TournamentProps> = () => {

  const [tournamentInfo, setTournamentInfo] = useState<TournamentClass>();
  const [playerSubscriptions, setPlayerSubscriptions] = useState([]);
  const [tournamentSessions, setTournamentSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch(apiPaths.tournamentsAPIEndpoint + window.location.pathname)
      .then((res) => res.json())
      .then((data) => {

        console.log('Getting tournament information: ', data)
        setTournamentInfo(data.tournament[0]);
        setTournamentSessions(data.sessions);
        setPlayerSubscriptions(data.playerSubscriptions); // Set player subscriptions here

      });

    //getSessionsInTournament('nes1')
  }, []);

  function getSessionsInTournament(tournamentID: string) {
    console.log('fetching: ' + apiPaths.tournamentsAPIEndpoint + apiPaths.getSessionsInTournament + `?tournamentID=${tournamentID}`)
    fetch(apiPaths.tournamentsAPIEndpoint + apiPaths.getSessionsInTournament + `?tournamentID=${tournamentID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Process the data as needed
      })
      .catch(error => {
        console.error("Error fetching sessions:", error);
      });
  }

  return (
    <div>
      <div className='boldBlue my-3'>{tournamentInfo?.tournament_id.toUpperCase()}</div>
      <div className="tournamentInformation">
        <div className="containerBox grid">

          <img src='/src/assets/nes1/nes1-map.avif' alt="Map"></img>
          <div className="text-center">
            <div>{tournamentInfo?.description}</div>
          </div>
        </div>
      </div>

      <br></br>

      <div className="flex flex-col mt-24 md:flex-row md:flex-wrap justify-center px-6">
        {tournamentSessions?.map((session: Session) => (
          <div className="flex flex-col items-center my-4 p-4 rounded-lg overflow-hidden">
            <div className='text-2xl text-customBlue font-bold'>{session.session_id.toLocaleUpperCase()}</div>
            <Link key={session.session_id} to={`/tournament/${tournamentInfo?.tournament_id}/${session.session_id}`}>
              <img className='object-cover w-80 h-60 hover:translate-y-1 flex-shrink-0' src={session.session_image_location} />
            </Link>
            <div className='text-customBlue font-bold text-wrap flex-grow'>{session.session_name.toLocaleUpperCase()}</div>
          </div>
        ))}
      </div>


      <div className="containerSessions">

      </div>
      <br></br>
      <div className='boldBlue'>PLAYER SUBSCRIPTIONS</div>
      <div className='myTableContainer'>
        <table>
          <thead>
            <tr className='tableRow'>
              <th>Player ID</th>
              <th>Nickname</th>
              <th>Favourite Army</th>
              <th>Has player paid</th>
              <th>Player points</th>
            </tr>
          </thead>
          <tbody>
            {playerSubscriptions.map((player: Player, index) => (
              <tr key={index} >
                <td>{player.player_id}</td>
                <td>{player.player_nickname}</td>
                <td style={{ textAlign: 'center' }}><img src={"../../../public/factions/" + `${player.favourite_army}.png`} onError={(e) => {
                  e.target.src = "../../../public/factions/null.png"; // Provide the path to your default image
                }} style={{ height: '70px' }}></img></td>
                <td style={{ textAlign: 'center' }}>{player.hasPlayerPayed ?
                  (<img src={"../../../public/session/paid.png"} style={{ height: '40px' }}></img>)
                  : (<img src={"../../../public/session/no-fee.png"} style={{ height: '40px' }}></img>)}
                </td>
                <td>{player.player_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default Tournament;
