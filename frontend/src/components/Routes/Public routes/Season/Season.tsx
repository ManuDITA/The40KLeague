import React, { FC, useEffect, useState } from 'react';
import './season.css'
import { Session } from '../../../../classes/Session';
import { Link } from 'react-router-dom';
import { SeasonClass } from '../../../../classes/Season';


interface SeasonProps { }

const Season: FC<SeasonProps> = () => {


  const [seasonInfo, setSeasonInfo] = useState(new SeasonClass)
  const [sessionList, setSessionList] = useState([])

  useEffect(() => {

    console.log(window.location.pathname)

    fetch(`https://q6ut75iqab.execute-api.eu-west-3.amazonaws.com/dev/${window.location.pathname}`)
      .then((res) => (res.json())).
      then((data) => {
        setSeasonInfo(data)
      })

    // Function will retrigger on URL change
    fetch(`https://q6ut75iqab.execute-api.eu-west-3.amazonaws.com/dev${window.location.pathname}/sessions`)
      .then((res) => (res.json()))
      .then((data) => {
        setSessionList(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, []);


  return (
    <div>
      <div className='boldBlue'>{seasonInfo?.seasonName}</div>
      <img src='/src/assets/nes1/nes1-map.avif'></img>
      <div>{seasonInfo?.seasonDescription}
      </div>
      <div className="container">
        {sessionList.map((ses: Session) =>
          <div>
            {ses?.seasonID} {ses.sessionID}
            <Link to={"/season/" + ses?.seasonID + "/session/" + ses?.sessionID}>
              <img className='seasonImage' src={ses.sessionImageLocation} />
            </Link>
          </div>
        )
        }
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
            {seasonInfo?.seasonRanking != undefined && seasonInfo?.seasonRanking.map((p, index) => {
              return (
                <tr key={index}>
                  <td>{p.RANK}</td>
                  <td>{p.NICKNAME}</td>
                  <td>{p.FACTION}</td>
                  <td>{p.PLAYED}</td>
                  <td>{p.PLT}</td>
                  <td>{p.SCORE}</td>
                </tr>
              )
            }
            )}

          </tbody>
        </table>
      </div>
    </div >
  )
}

export default Season;
