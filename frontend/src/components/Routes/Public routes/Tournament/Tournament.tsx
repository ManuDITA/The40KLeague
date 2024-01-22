import React, { FC, useEffect, useState } from 'react';
import './Tournament.css'
import { Session } from '../../../../../../classes/Session';
import { Link } from 'react-router-dom';
import { TournamentClass } from '../../../../../../classes/TournamentClass';
import apiPaths from '../../../../../../apiList';
import { Player } from '../../../../../../classes/Player';

import { TbSortAscendingNumbers } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";
import { IoMdPricetags } from "react-icons/io";
import { FaUsers } from "react-icons/fa";



interface TournamentProps { }

const Tournament: FC<TournamentProps> = () => {

  const [tournamentInfo, setTournamentInfo] = useState<TournamentClass>();
  const [playerSubscriptions, setPlayerSubscriptions] = useState([]);
  const [tournamentSessions, setTournamentSessions] = useState<Session[]>([]);

  const [isEnrollmentPeriod, setIsEnrollmentPeriod] = useState(false);
  const [isPlayingPeriod, setIsPlayingPeriod] = useState(false);
  const [isEndingPeriod, setIsEndingPeriod] = useState(false);

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

  useEffect(() => {
    if (tournamentInfo) {
      let today = new Date();
      if (today < new Date(tournamentInfo.start_date))
        setIsEnrollmentPeriod(true)
      else if (today < new Date(tournamentInfo.end_date))
        setIsPlayingPeriod(true)
      else if (today > new Date(tournamentInfo.end_date))
        setIsEndingPeriod(true)
    }
  }, [tournamentInfo])

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
      <div className='boldBlue pt-10'>{tournamentInfo?.tournament_id.toUpperCase()}</div>
      <div className="container w- pb-16 flex flex-col xl:flex-row xl:items-center justify-evenly mx-auto  text-center">
        <img src='/src/assets/nes1/nes1-map.avif' alt="Map" className='mx-10 mt-10 w-2/4 xl:w-1/3 xl:max-h-48 object-contain'></img>
        <div className="text-center mx-10 mt-10 xl:w-1/3">
          <div>{tournamentInfo?.description}</div>
        </div>
        <div className='mx-10 mt-10 xl:w-1/3'>
          <div className=' text-3xl pb-2'>
            Tournament status
          </div>
          <div>
            <table className='items-center w-full text-white border-gray-600 border-2 bg-cyan-400'>
              <tr className=''>
                <div className={`py-3  ${isEnrollmentPeriod ? "text-white bg-customRed " : 'bg-white text-black'}`}>
                  Registration open
                </div>
              </tr>
              <tr className=''>
                <div className={`py-3 ${isPlayingPeriod ? "text-white bg-customRed " : 'bg-white text-black'} `}>
                  Playing
                </div>
              </tr>
              <tr className=''>
                <div className={`py-3  ${isEndingPeriod ? "text-white bg-customRed " : 'bg-white text-black'}`}>
                  Finished
                </div>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div className='container flex flex-row mx-auto items-start justify-evenly'>
        <div className=''>
          <div className='text-neutral-700'>
            <div className='text-7xl'>
              <GiReceiveMoney />
            </div>
            Cost
          </div>
          <div className='text-6xl text-red-700'>
            {tournamentInfo?.entry_cost}€
          </div>
        </div>
        <div>
          <div className='text-neutral-700'>
            <div className=' text-7xl'>
              <IoMdPricetags />
            </div>
            Tags
          </div>
          <div className='text-6xl text-red-700'>
            
          </div>

        </div>

        <div>
          <div className='text-neutral-700'>
            <div className=' text-7xl'>
              <FaUsers />
            </div>
            Players
          </div>
          <div className='text-6xl text-red-700'>
            {tournamentInfo?.max_player_count}
          </div>

        </div>

        <div>
          <div className='text-neutral-700'>
            <div className=' text-7xl'>
              <TbSortAscendingNumbers />
            </div>
            Sessions
          </div>
          <div className='text-6xl text-red-700'>
            {tournamentInfo?.number_of_sessions}
          </div>
        </div>
      </div>

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
