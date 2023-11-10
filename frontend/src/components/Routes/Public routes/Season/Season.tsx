import React, { FC, useEffect, useState } from 'react';
import './season.css'
import { Session } from '../../../../classes/Session';


interface SeasonProps { }

const Season: FC<SeasonProps> = () => {

  const [sessionList, setSessionList] = useState([])

  useEffect(() => {

    console.log(window.location.pathname)
    // Function will retrigger on URL change
    fetch(`https://q6ut75iqab.execute-api.eu-west-3.amazonaws.com/dev${window.location.pathname}`)
      .then((res) => (res.json()))
      .then((data) => {
        setSessionList(data)
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, []);


  return (
    <div>
      <img src='/src/assets/nes1/nes1-map.avif'></img>
      <div>
      </div>
      <div className="containerimages">
        {sessionList.map((ses:Session) => 
            <div>{ses?.seasonID} {ses.sessionID}
            <img src={ses.sessionImageLocation}/>

            </div>
        )
        }
      </div>
    </div>
  )
}

export default Season;
