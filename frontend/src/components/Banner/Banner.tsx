import './banner.css'
import React, { useContext } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { Match } from '../../../../classes/match';
import { Auth } from 'aws-amplify';
import apiPaths from '../../../../apiList';
import { UserContext } from '../../App';



//const { isUserAuthenticated, setIsUserAuthenticated, token, setToken } = useContext(UserContext)

function Banner(prop: any) {


  const [match, setMatch] = useState<Match | undefined>();
  const [date, setDate] = useState<string | undefined>();
  const divRef = useRef<HTMLDivElement>(null);

  const [whatPlayerIsThisUser, setWhatPlayerIsThisUser] = useState<number>(0);
  const [player1_score, setPlayer1_score] = useState<number>();
  const [player2_score, setPlayer2_score] = useState<number>();

  let user;

  useEffect(() => {
    // Your effect logic here
    // For example, if you want to update player names and icons when 'prop' changes:

    const inputDate = new Date(prop.prop.match_date);
    prop.prop.match_date = `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`;
    if (prop.prop.match_date == '1/1/1970') {
      prop.prop.match_date = 'N/A'
    }
    console.log(prop.prop)
    setMatch(prop.prop);


  }, [prop]);

  useEffect(() => {
    if (match != undefined)
      getCurrentUser()
  }, [match])


  async function getCurrentUser() {
    user = await Auth.currentUserPoolUser()

    if (user.username == match?.player1_name.toLowerCase()) {
      setWhatPlayerIsThisUser(1)
    } else if (user.username == match?.player2_name.toLowerCase()) {
      setWhatPlayerIsThisUser(2)
    }
  }

  const acceptMatch = async () => {
    //set is_match_played to 1
    const requestBody = {
      match_id: match?.match_id,
    };

    console.log('fetching ' + apiPaths.matchesAPIEndpoint + apiPaths.acceptMatch)
    await fetch(apiPaths.matchesAPIEndpoint + apiPaths.acceptMatch, {
      method: 'PATCH',
      headers: {
        'Authorization': 'eyJraWQiOiJzRXRcL2FuOGVQdzhvM285M0hpK2JFMFwveGIzakwyOEZJRzJYSTZyNEN6eUE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjMDk2ZmIyYS1iMDVmLTQ4MWItYjEwYS03ZGFjN2QwNmQ1M2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMy5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTNfYzE5Z3k2emwxIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6Im1hbnUiLCJvcmlnaW5fanRpIjoiZmE2OTVkZDQtZWNjNS00ZDM4LTkzZjgtZGMxMzM0YWQ1ZTg0IiwiYXVkIjoiNmdwNzl0dGFrcHR0ZHI0MnZzbWNxcmsxM2siLCJldmVudF9pZCI6IjJiNmZkNGJiLWM5ZTctNDFhNy04MjI2LWJjZjhiY2RmOGZlNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzAzNDU0NzY0LCJuYW1lIjoiRW1hbnVlbGUgU2ltZW9uZSIsInBob25lX251bWJlciI6IiszOTM4ODY5MzAzNTUiLCJleHAiOjE3MDM0NTgzNjQsImlhdCI6MTcwMzQ1NDc2NCwianRpIjoiYjRmN2Q2NDQtZGQxMC00NGNiLThmNjUtOGRkN2JiOTIyMDQ4IiwiZW1haWwiOiJlbWFudWVsZXNpbWVvbmUwQGdtYWlsLmNvbSJ9.e2gaCMrmqtnXT1Mx4iA3ThtKWfZUvnFcShhAo_ZIM7awHJ4HS9szdzQRVlYetzrA3apYJhDKIHgDDHk-glxIxlXg2wS6e2J752oGOr3-cYRQ14JKVyvO5uTX3KKRD09xyTN73u4k1QZI8F1S2aa98Tu7PHTo6_xLgy6AmjMiEBc0a7skxsE3pI-GLC9e0ajCQ47tZU-LPzpQk5W5ByOuex8XeU_I0-tBgcp29z7vlMqbn3iCKPW8NhrQfFYzaEbuoRXvbHkGObz3GjN-WETNNRWApqmR5Cyn6dSQ62hH539GByjEtv5Tz8HilJsOXgxC9yP05ZxMNmopUgS9Sypr3w'
      },
      body: JSON.stringify(requestBody), // Convert the body to JSON
    }
    ).then((res) => (res.json()))
      .then((output) => {
        console.log(output)
        getMatch()
      })
  }

  const getMatch = async () => {

    console.log('fetching ' + apiPaths.matchesAPIEndpoint + apiPaths.getMatch + '/' + match?.match_id)
    await fetch(apiPaths.matchesAPIEndpoint + apiPaths.getMatch + '/' + match?.match_id, {
      method: 'GET',
      headers: {
        'Authorization': 'eyJraWQiOiJzRXRcL2FuOGVQdzhvM285M0hpK2JFMFwveGIzakwyOEZJRzJYSTZyNEN6eUE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjMDk2ZmIyYS1iMDVmLTQ4MWItYjEwYS03ZGFjN2QwNmQ1M2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMy5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTNfYzE5Z3k2emwxIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6Im1hbnUiLCJvcmlnaW5fanRpIjoiZmE2OTVkZDQtZWNjNS00ZDM4LTkzZjgtZGMxMzM0YWQ1ZTg0IiwiYXVkIjoiNmdwNzl0dGFrcHR0ZHI0MnZzbWNxcmsxM2siLCJldmVudF9pZCI6IjJiNmZkNGJiLWM5ZTctNDFhNy04MjI2LWJjZjhiY2RmOGZlNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzAzNDU0NzY0LCJuYW1lIjoiRW1hbnVlbGUgU2ltZW9uZSIsInBob25lX251bWJlciI6IiszOTM4ODY5MzAzNTUiLCJleHAiOjE3MDM0NTgzNjQsImlhdCI6MTcwMzQ1NDc2NCwianRpIjoiYjRmN2Q2NDQtZGQxMC00NGNiLThmNjUtOGRkN2JiOTIyMDQ4IiwiZW1haWwiOiJlbWFudWVsZXNpbWVvbmUwQGdtYWlsLmNvbSJ9.e2gaCMrmqtnXT1Mx4iA3ThtKWfZUvnFcShhAo_ZIM7awHJ4HS9szdzQRVlYetzrA3apYJhDKIHgDDHk-glxIxlXg2wS6e2J752oGOr3-cYRQ14JKVyvO5uTX3KKRD09xyTN73u4k1QZI8F1S2aa98Tu7PHTo6_xLgy6AmjMiEBc0a7skxsE3pI-GLC9e0ajCQ47tZU-LPzpQk5W5ByOuex8XeU_I0-tBgcp29z7vlMqbn3iCKPW8NhrQfFYzaEbuoRXvbHkGObz3GjN-WETNNRWApqmR5Cyn6dSQ62hH539GByjEtv5Tz8HilJsOXgxC9yP05ZxMNmopUgS9Sypr3w'
      }
    }
    ).then((res) => (res.json()))
      .then((output) => {
        console.log(output)

        const inputDate = new Date(output[0].match_date);
        output[0].match_date = `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`;
        setMatch(output[0])
      })
  }

  const refuseMatch = async () => {
    //set match_score_acceptance to 0
    const requestBody = {
      match_id: match?.match_id,
    };

    console.log('fetching ' + apiPaths.matchesAPIEndpoint + apiPaths.refuseMatch)
    await fetch(apiPaths.matchesAPIEndpoint + apiPaths.refuseMatch, {
      method: 'PATCH',
      headers: {
        'Authorization': 'eyJraWQiOiJzRXRcL2FuOGVQdzhvM285M0hpK2JFMFwveGIzakwyOEZJRzJYSTZyNEN6eUE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjMDk2ZmIyYS1iMDVmLTQ4MWItYjEwYS03ZGFjN2QwNmQ1M2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMy5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTNfYzE5Z3k2emwxIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6Im1hbnUiLCJvcmlnaW5fanRpIjoiZmE2OTVkZDQtZWNjNS00ZDM4LTkzZjgtZGMxMzM0YWQ1ZTg0IiwiYXVkIjoiNmdwNzl0dGFrcHR0ZHI0MnZzbWNxcmsxM2siLCJldmVudF9pZCI6IjJiNmZkNGJiLWM5ZTctNDFhNy04MjI2LWJjZjhiY2RmOGZlNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzAzNDU0NzY0LCJuYW1lIjoiRW1hbnVlbGUgU2ltZW9uZSIsInBob25lX251bWJlciI6IiszOTM4ODY5MzAzNTUiLCJleHAiOjE3MDM0NTgzNjQsImlhdCI6MTcwMzQ1NDc2NCwianRpIjoiYjRmN2Q2NDQtZGQxMC00NGNiLThmNjUtOGRkN2JiOTIyMDQ4IiwiZW1haWwiOiJlbWFudWVsZXNpbWVvbmUwQGdtYWlsLmNvbSJ9.e2gaCMrmqtnXT1Mx4iA3ThtKWfZUvnFcShhAo_ZIM7awHJ4HS9szdzQRVlYetzrA3apYJhDKIHgDDHk-glxIxlXg2wS6e2J752oGOr3-cYRQ14JKVyvO5uTX3KKRD09xyTN73u4k1QZI8F1S2aa98Tu7PHTo6_xLgy6AmjMiEBc0a7skxsE3pI-GLC9e0ajCQ47tZU-LPzpQk5W5ByOuex8XeU_I0-tBgcp29z7vlMqbn3iCKPW8NhrQfFYzaEbuoRXvbHkGObz3GjN-WETNNRWApqmR5Cyn6dSQ62hH539GByjEtv5Tz8HilJsOXgxC9yP05ZxMNmopUgS9Sypr3w'
      },
      body: JSON.stringify(requestBody), // Convert the body to JSON
    }
    ).then((res) => (res.json()))
      .then((output) => {
        console.log(output)
        getMatch()
      })
  }

  const sendMatchScore = async () => {
    //set match_score_acceptance to 0
    const requestBody = {
      match_id: match?.match_id,
      match_score_acceptance: whatPlayerIsThisUser,
      player1_score: player1_score,
      player2_score: player2_score
    };

    console.log('fetching ' + apiPaths.matchesAPIEndpoint + apiPaths.insertScore)
    await fetch(apiPaths.matchesAPIEndpoint + apiPaths.insertScore, {
      method: 'PATCH',
      headers: {
        'Authorization': 'eyJraWQiOiJzRXRcL2FuOGVQdzhvM285M0hpK2JFMFwveGIzakwyOEZJRzJYSTZyNEN6eUE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjMDk2ZmIyYS1iMDVmLTQ4MWItYjEwYS03ZGFjN2QwNmQ1M2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMy5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTNfYzE5Z3k2emwxIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6Im1hbnUiLCJvcmlnaW5fanRpIjoiZmE2OTVkZDQtZWNjNS00ZDM4LTkzZjgtZGMxMzM0YWQ1ZTg0IiwiYXVkIjoiNmdwNzl0dGFrcHR0ZHI0MnZzbWNxcmsxM2siLCJldmVudF9pZCI6IjJiNmZkNGJiLWM5ZTctNDFhNy04MjI2LWJjZjhiY2RmOGZlNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzAzNDU0NzY0LCJuYW1lIjoiRW1hbnVlbGUgU2ltZW9uZSIsInBob25lX251bWJlciI6IiszOTM4ODY5MzAzNTUiLCJleHAiOjE3MDM0NTgzNjQsImlhdCI6MTcwMzQ1NDc2NCwianRpIjoiYjRmN2Q2NDQtZGQxMC00NGNiLThmNjUtOGRkN2JiOTIyMDQ4IiwiZW1haWwiOiJlbWFudWVsZXNpbWVvbmUwQGdtYWlsLmNvbSJ9.e2gaCMrmqtnXT1Mx4iA3ThtKWfZUvnFcShhAo_ZIM7awHJ4HS9szdzQRVlYetzrA3apYJhDKIHgDDHk-glxIxlXg2wS6e2J752oGOr3-cYRQ14JKVyvO5uTX3KKRD09xyTN73u4k1QZI8F1S2aa98Tu7PHTo6_xLgy6AmjMiEBc0a7skxsE3pI-GLC9e0ajCQ47tZU-LPzpQk5W5ByOuex8XeU_I0-tBgcp29z7vlMqbn3iCKPW8NhrQfFYzaEbuoRXvbHkGObz3GjN-WETNNRWApqmR5Cyn6dSQ62hH539GByjEtv5Tz8HilJsOXgxC9yP05ZxMNmopUgS9Sypr3w'
      },
      body: JSON.stringify(requestBody), // Convert the body to JSON
    }
    ).then((res) => (res.json()))
      .then((output) => {
        console.log(output)
        getMatch()
      })
  }

  return (

    <span >
      {/*match?.score == undefined &&
        <></>
  */}

      <div className='rectangle' ref={divRef}>

        <div className='innerRectangle'>
          {<div className='match_id'>
            {match?.match_id}
          </div>
          }

          {match?.utg_player == 1 &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon1'></img>
          }

          {match?.utg_player == 2 &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon2'></img>
          }


          {
            //check if the match can be modified from current context and if a score has already been proposed
            (prop.canBeModified == false || match?.match_score_acceptance != 0) &&
            <div className='score'>
              {match?.player1_score != undefined && match.player1_score} - {match?.player2_score != undefined && match.player2_score}
            </div>
          }


          {
            //check if the match can be modified from current context and if no one proposed a match score
            prop.canBeModified == true && match?.match_score_acceptance == 0 &&
            <div className='score'>
              <input className='inputScorePlayer1' type='number' value={player1_score} onChange={(e) => (setPlayer1_score(e.target.valueAsNumber))}></input> - <input className='inputScorePlayer1' type='number' value={player2_score} onChange={(e) => (setPlayer2_score(e.target.valueAsNumber))}></input>
            </div>
          }
          <div className='matchType'>
            {match?.game_code}
          </div>
          <div className='is_match_played'>
            {match?.match_date}
          </div>

          <div className='player1_name'>
            {match?.player1_name}
          </div>

          <div className='player2_name'>
            {match?.player2_name}
          </div>

          <img src={"../../../public/factions/" + `${match?.player1_army}.png`} className='player1Icon'></img>

          <img src={"../../../public/factions/" + `${match?.player2_army}.png`} className='player2Icon'></img>

          <img src={'../../../public/banner/battle1.png'} className='iconBattle1'></img>
          <img src={'../../../public/banner/battle2.png'} className='iconBattle2'></img>

        </div>

      </div>

      {prop.canBeModified == true && match?.match_score_acceptance == whatPlayerIsThisUser &&
        <div>You sent this match - {match.match_id}
        </div>
      }


      {//if match has score and is not accepted, means that this player has to accept or refuse the modification
        (prop.canBeModified == true && match?.is_match_played == 0 && match?.match_score_acceptance != whatPlayerIsThisUser && match?.match_score_acceptance != 0) &&
        <>
          <div>You have to approve this match!
            <button onClick={acceptMatch}>V</button>
            <button onClick={refuseMatch}>X</button>
          </div>
        </>
      }

      {
        (prop.canBeModified == true && match?.is_match_played == 0 && match?.match_score_acceptance == 0 &&
          <div>Anyone can edit this match
            <button onClick={sendMatchScore}>Send Match Score</button>
          </div>

        )
      }

      {
        (prop.canBeModified == true && match?.is_match_played == 0 && match?.match_score_acceptance == whatPlayerIsThisUser &&
          <div>Waiting for approval</div>)
      }

      {
        (prop.canBeModified == true && match?.is_match_played == 1 && match?.match_score_acceptance != whatPlayerIsThisUser &&
          <div>You approved this match</div>)
      }

    </span>
  );
}


export default Banner;
