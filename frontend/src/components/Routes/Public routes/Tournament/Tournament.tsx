import React, { FC, useEffect, useState } from 'react';
import './Tournament.css'
import { Session } from '../../../../../../classes/Session';
import { Link } from 'react-router-dom';
import { TournamentClass } from '../../../../../../classes/TournamentClass';
import apiPaths from '../../../../../../apiList';
import { Player } from '../../../../../../classes/Player';

interface TournamentProps { }

const Tournament: FC<TournamentProps> = () => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  };

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
    <div className='tournamentInfo'>
      <div className='boldBlue'>{tournamentInfo?.tournament_id.toUpperCase()}</div>
      <img src='/src/assets/nes1/nes1-map.avif' alt="Map"></img>
      <div className="description">{tournamentInfo?.description}</div>

      <br></br>
      <div className="containerSessions">
        {tournamentSessions?.map((session: Session) => (
          <div className='singleSessionContainer'>

            <div className={'boldBlue ' + (session.is_session_active ? 'boldRed' : '')} style={{ textAlign: 'center' }}>{session.session_id.toLocaleUpperCase()}</div>
            <Link key={session.session_id} to={`/tournament/${tournamentInfo?.tournament_id}/${session.session_id}`}>
              <img className='sessionImage' src={session.session_image_location} />
            </Link>
            <div className='boldBlue sessionNameDescription'>{session.session_name.toLocaleUpperCase()}</div>
            <div>Start {session.session_start_date}</div>
            <div>End {session.session_end_date}</div>
          </div>
        ))}
      </div>
      <br></br>
      <div className='boldBlue'>PLAYER SUBSCRIPTIONS</div>
      <div className='myTableContainer'>
        <table>
          <thead>
            <tr className='tableRow'>
              <th>Player ID</th>
              <th>Nickname</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Favourite Army</th>
              <th>Has player payed</th>
              <th>Player points</th>
            </tr>
          </thead>
          <tbody>
            {playerSubscriptions.map((player: Player, index) => (
              <tr key={index}>
                <td>{player.player_id}</td>
                <td>{player.player_nickname}</td>
                <td>{player.player_age}</td>
                <td>{player.player_email}</td>
                <td>{player.player_phone_number}</td>
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
    </div>
  );
};

export default Tournament;
