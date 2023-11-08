import React, { FC, useEffect, useState } from 'react';
import './season.css'
import { Session } from '../../../../classes/Session';


interface SeasonProps { }

const Season: FC<SeasonProps> = () => {

  const [sessionList, setSessionList] = useState([])

  useEffect(() => {
    // Function will retrigger on URL change
    fetch(`http://localhost:3000/getnes1`)
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
      <div>Bienvenue sur l'édition Neuchâtel du site Warhammer 40,000 pour la Suisse ! Préparez-vous à plonger dans l'obscurité sinistre du futur lointain alors que vous vous engagez dans un voyage épique de stratégie, de guerre et de batailles intenses.
        Ici, vous pouvez sélectionner la session et accéder directement à toutes les informations concernant cette session.
        Début 17/07/2023
      </div>
      <div className="containerimages">
        {sessionList.map((ses:Session) => 
            <span>
              <img src={`/src/assets/nes1-${ses.sessionPostfix}-banner.avif`} className="image"></img>
            </span>
        )
        }
      </div>
    </div>
  )
}

export default Season;
