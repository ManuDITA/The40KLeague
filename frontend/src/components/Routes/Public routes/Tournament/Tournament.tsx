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

  useEffect(() => {
    fetch(apiPaths.tournamentsAPIEndpoint + window.location.pathname)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setTournamentInfo(data.tournament[0]);
        setPlayerSubscriptions(data.playerSubscriptions); // Set player subscriptions here
      });
  }, []);

  return (
    <div>
      <div className='boldBlue'>{tournamentInfo?.tournament_id}</div>
      <img src='/src/assets/nes1/nes1-map.avif' alt="Map"></img>
      <div>{tournamentInfo?.description}</div>

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
                <td>{player.favourite_army}</td>
                <td>{player.hasPlayerPayed}</td>
                <td>{player.player_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='boldBlue'>SEASON CLASSEMENT</div>
      <div className='myTableContainer'>
        <table>
          <thead>
            <tr className='tableRow'>
              <th>RANK</th>
              <th>NICKNAME</th>
              <th>FACTION</th>
              <th>PLAYED</th>
              <th>PLT</th>
              <th>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {tournamentInfo?.seasonRanking != undefined && tournamentInfo?.seasonRanking.map((p, index) => {
              return (
                <tr key={index}>
                  <td>{p.RANK}</td>
                  <td>{p.NICKNAME}</td>
                  <td>{p.FACTION}</td>
                  <td>{p.PLAYED}</td>
                  <td>{p.PLT}</td>
                  <td>{p.SCORE}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tournament;
