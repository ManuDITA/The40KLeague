import React, { FC, useContext, useEffect, useState } from 'react';
import './Tournament.css'
import { Session } from '../../../../../../classes/Session';
import { Link, useNavigate } from 'react-router-dom';
import { TournamentClass } from '../../../../../../classes/TournamentClass';
import apiPaths from '../../../../../../apiList';
import { Player } from '../../../../../../classes/Player';

import { TbSortAscendingNumbers } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";
import { LuDices } from "react-icons/lu";

import { IoMdClose, IoMdPricetags } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { CognitoUserContext, isUserAuthenticatedContext } from '../../../../App';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Lists } from '../../../../../../classes/Lists';
import { MyPicker } from '../../../ElementPicker/elementPicker';
import { PieChart } from '@mui/x-charts/PieChart';



interface TournamentProps { }

const Tournament: FC<TournamentProps> = () => {

  const [tournamentInfo, setTournamentInfo] = useState<TournamentClass>();
  const [playerSubscriptions, setPlayerSubscriptions] = useState([]);
  const [tournamentSessions, setTournamentSessions] = useState<Session[]>([]);

  const [isEnrollmentPeriod, setIsEnrollmentPeriod] = useState(false);
  const [isPlayingPeriod, setIsPlayingPeriod] = useState(false);
  const [isEndingPeriod, setIsEndingPeriod] = useState(false);

  const navigator = useNavigate()

  const [isEnrollmentFormVisible, setIsEnrollmentFormVisible] = useState(false);


  const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)
  const { cognitoUser, setCognitoUser } = useContext(CognitoUserContext)

  useEffect(() => {
    fetch(apiPaths.tournamentsAPIEndpoint + window.location.pathname)
      .then((res) => res.json())
      .then((data) => {

        console.log('Getting tournament information: ', data)
        setTournamentInfo(data.tournament[0]);
        setTournamentSessions(data.sessions);
        console.log(data.playerSubscriptions)
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

  const toggleEnrollmentForm = () => {
    setIsEnrollmentFormVisible(!isEnrollmentFormVisible);
  };


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
      <div className='text-green40k text-center justify-center mx-auto font-arial-black text-5xl pt-20'>{tournamentInfo?.tournament_name.toUpperCase()}</div>
      <div className="container w- xl:pb-6 flex flex-col xl:flex-row xl:items-center justify-evenly mx-auto  text-center">
        <img src='/tournament.png' alt="Map" className='mx-10 xl:max-h-48  object-contain'></img>
        <div className="text-center text-base mx-10 xl:w-1/3">
          <div>{tournamentInfo?.description}</div>
        </div>
        <div className='mx-10 xl:w-1/3'>
          <div className=''>
            <MyPicker selections={['New', 'Registration open', 'Reg closed', 'List submission closed', 'Pairing publication', 'Playing', 'Finished']} startingSelectionIndex={1}></MyPicker>
          </div>
        </div>
      </div>

      <div className="container pb-8 flex flex-col xl:flex-row xl:items-center justify-evenly mx-auto  text-center">
        <div className='flex flex-row items-center mr-10'>
          <PieChart series={[
            {
              data: [

                //enrolled only
                { id: 1, value: 30, color: '#105C75' },

                //enrolled and confirmed
                { id: 2, value: 20, color: '#A37E2C' },
                //remaining spots
                { id: 3, value: 15, color: '#eeeeee' },
              ],
              innerRadius: 80,
              outerRadius: 100,
              cornerRadius: 0,
              startAngle: 30,
              endAngle: 390
            },

          ]}
            width={200}
            height={200}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            slotProps={{ legend: { hidden: true } }}
            colors={['red, transparent']} />
          <div className='flex flex-row items-end'>
            <div className='mx-4'>
              <div className='font-semibold text-9xl font-arial text-green40k '>
                30
              </div>
              <div className='text-green40k'>
                Pre-Enrolled
              </div>
            </div>

            <div className='mx-4'>
              <div className='font-semibold text-9xl font-arial text-gold40k '>
                20
              </div>
              <div className='text-gold40k'>
                Confirmed
              </div>
            </div>

            <div className='mx-4'>
              <div className='font-semibold text-7xl font-arial text-black40klight '>
                80
              </div>
              <div className='text-black40klight'>
                Total spots
              </div>
            </div>
          </div>
        </div>

        <div>

          {isEnrollmentPeriod && (
            (isUserAuthenticated ? (
              <>
                <div className='bg-green40k text-white40k font-arial-black text-3xl px-10 my-4 py-6 rounded-xl shadow-lg hover:bg-gold40k hover:cursor-pointer' onClick={toggleEnrollmentForm}>Pre-register</div>
                <div className='bg-red40k text-white40k font-arial-black text-3xl px-10 py-6 rounded-xl shadow-lg hover:bg-red40klight text-nowrap hover:cursor-pointer'>Delete subscription</div>
              </>) : (
              <div className='bg-green40k text-white40k font-arial-black text-3xl px-10 my-4 py-6 rounded-xl shadow-lg hover:bg-gold40k hover:cursor-pointer' onClick={()=>navigator('/login')}>Register to enroll</div>
            ))
          )}


        </div>
      </div>



      <div className='container flex flex-row mx-auto items-start justify-evenly'>
        <div className='flex flex-col items-center text-neutral-700'>
          <GiReceiveMoney className='text-7xl ' />
          Cost
          <div className='text-6xl text-red40k'>
            {tournamentInfo?.entry_cost}€
          </div>
        </div>

        <div className='flex flex-col items-center text-neutral-700'>
          <IoMdPricetags className='text-7xl ' />
          Tags
          <div className='text-6xl text-red40k'>
          </div>
        </div>

        <div className='flex flex-col items-center text-neutral-700'>
          <FaUsers className='text-7xl ' />
          Players
          <div className='text-6xl text-red40k'>
            {tournamentInfo?.max_player_count}
          </div>
        </div>

        <div className='flex flex-col items-center text-neutral-700'>
          <LuDices className='text-7xl ' />
          Match generation type
          <div className='text-6xl text-red40k'>
            {tournamentInfo?.match_generation_type}
          </div>
        </div>

        <div className='flex flex-col items-center text-neutral-700'>
          <TbSortAscendingNumbers className='text-7xl ' />
          Sessions
          <div className='text-6xl text-red40k'>
            {tournamentInfo?.number_of_sessions}
          </div>
        </div>
      </div>



      <div className="flex flex-col mt-24 md:flex-row md:flex-wrap justify-center px-6">
        {tournamentSessions?.map((session: Session) => (
          <div className="flex flex-col items-center my-4 p-4 rounded-lg overflow-hidden">
            <div className='text-2xl text-green40k font-bold'>{session.session_id.toLocaleUpperCase()}</div>
            <Link key={session.session_id} to={`/tournament/${tournamentInfo?.tournament_id}/${session.session_id}`}>
              <img className='object-cover w-80 h-60 hover:translate-y-1 flex-shrink-0' src={session.session_image_location} />
            </Link>
            <div className='text-green40k font-bold text-wrap flex-grow'>{session.session_name.toLocaleUpperCase()}</div>
          </div>
        ))}
      </div>

      <div className='green40k'>PLAYER SUBSCRIPTIONS</div>
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
                <td style={{ textAlign: 'center' }}><img src={"/factions/" + `${player.list_army}.png`} onError={(e) => {
                  e.target.src = "/factions/null.png"; // Provide the path to your default image
                }} style={{ height: '70px' }}></img></td>
                <td style={{ textAlign: 'center' }}>{player.hasPlayerPayed ?
                  (<img src={"/session/paid.png"} style={{ height: '40px' }}></img>)
                  : (<img src={"/session/no-fee.png"} style={{ height: '40px' }}></img>)}
                </td>
                <td>{player.player_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEnrollmentFormVisible && <EnrollmentForm onClose={toggleEnrollmentForm} />}
    </div >
  );
};

export default Tournament;

interface EnrollmentFormProps {
  onClose: () => void;
}

const EnrollmentForm: FC<EnrollmentFormProps> = ({ onClose }) => {


  const { cognitoUser, setCognitoUser } = useContext(CognitoUserContext)
  const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)
  const [playerLists, setPlayerLists] = useState<Lists | undefined>();

  useEffect(() => {
    console.log('is user authenticated: ', isUserAuthenticated)
    if (isUserAuthenticated == true) {
      getUserLists()
    }
  }, [isUserAuthenticated])

  function getUserLists() {
    console.log('fetching lists for the tournament enrollment')
    //TODO: change this api call path
    fetch(apiPaths.playersAPIEndpoint + apiPaths.player + "/" + cognitoUser.username + '/lists', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cognitoUser.signInUserSession.idToken.jwtToken
      }
    }).then((res) => (res.json()))
      .then((output) => {
        console.log("Player lists: ", output)
        setPlayerLists(output)
      })

  }


  const initialValues = {
    list: '',
    // Add other form fields here
  };

  const validationSchema = Yup.object({
    list: Yup.string().required('Enrollment list is required'),
    // Add validation for other form fields
  });

  const onSubmit = async (values: typeof initialValues) => {
    // Handle form submission logic
    console.log('Form submitted with values:', values);

    const selectedList: Lists = playerLists ? playerLists[parseInt(values.list)] : undefined;

    const requestBody = {
      //TODO: change tournament_id
      tournament_id: 'nes1',
      player_id: selectedList.player_id,
      list_id: selectedList.list_id,
      list_army: selectedList.list_army,
      list_name: selectedList.list_name,
      list_description: selectedList.list_description
    }

    console.log('requestbody: ', requestBody)

    console.log('fetching: ' + apiPaths.tournamentsAPIEndpoint + apiPaths.tournamentSubscription + '/' + 'nes1' + apiPaths.enrollTournament)
    await fetch(apiPaths.tournamentsAPIEndpoint + apiPaths.tournamentSubscription + '/' + 'nes1' + apiPaths.enrollTournament, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cognitoUser.signInUserSession.idToken.jwtToken
      },
      body: JSON.stringify(requestBody)
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch(error => {
        console.error("Error fetching tournament subscription:", error);
      })

    onClose(); // Close the form after submission
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white relative p-6 rounded-xl shadow-lg" >

        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl rounded-md border-black m-2 hover:cursor-pointer hover:bg-red40k hover:text-white40k"
        >
          <IoMdClose />
        </button>

        {//list insertion top bar
        }
        <div className=''>

        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="list" className="block text-2xl overflow-visible font-bold text-green40k font-arial-black">
              Submit your list
            </label>
            <div className=' mb-2'>
              Select a list from the ones you created
            </div>

            <select
              id="list"
              name="list"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.list}
              className={`border bg-white rounded w-full py-2 px-3 ${formik.touched.list && formik.errors.list ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value={''} className='bg-white' label="Select a parameter" />
              {playerLists != undefined && playerLists.map((list: Lists, index) => (
                <option key={index} value={index} label={list.list_name} />
              ))}
            </select>


            {formik.touched.list && formik.errors.list && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.list}</div>
            )}
          </div>
          {/* Add other form fields here */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};