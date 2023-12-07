import './banner.css'
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { Match } from '../../classes/match'

function Banner(prop: any) {

  const [match, setMatch] = useState<Match | undefined>();
  const [date, setDate] = useState<string | undefined>();
  const divRef = useRef<HTMLDivElement>(null); // Use HTMLElement type assertion with null initial value



  useEffect(() => {
    // Your effect logic here
    // For example, if you want to update player names and icons when 'prop' changes:
    setMatch(prop.prop);


  }, [prop]);

  useEffect(() => {

    //console.log(match)
    if (match?.statusPlayed != undefined && match?.statusPlayed != "Not Played yet") {

        const date = new Date((match.statusPlayed - 25569) * 86400 * 1000);
        //console.log(date)
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();

        setDate(day + '.' + month + '.' + year);

    } else {
      if( match?.statusPlayed == "Not Played yet")
        setDate("Not Played Yet")
    }

  }, [match])


  return (

    <div >
      {/*match?.score == undefined &&
        <></>
  */}


      <div className='rectangle' ref={divRef}>
        <div className='innerRectangle'>


          {match?.utgPlayer == match?.player1 && match?.attacker == true &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon1'></img>
          }

          {match?.utgPlayer == match?.player1 && match?.attacker == false &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon2'></img>
          }

          {match?.utgPlayer == match?.player2 && match?.attacker == true &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon2'></img>
          }
          {match?.utgPlayer == match?.player2 && match?.attacker == false &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon1'></img>
          }

          <div className='score'>
            {match?.score == undefined && '. – .'}
            {match?.score != undefined && match.score}
          </div>

          <div className='matchType'>
            {match?.gameType} - {match?.gameCode}
          </div>
          <div className='statusPlayed'>
            {date}
          </div>

          <div className='player1'>
            {match?.attacker == true &&
              match?.player1}
            {!match?.attacker == true &&
              match?.player2}
          </div>

          <div className='player2'>
            {match?.attacker == true &&
              match?.player2}
            {!match?.attacker == true &&
              match?.player1}
          </div>

          {match?.attacker == true &&
            <img src={"../../../public/factions/" + `${match?.army1}.png`} className='player1Icon'></img>
          }
          {match?.attacker == true &&
            <img src={"../../../public/factions/" + `${match?.army2}.png`} className='player2Icon'></img>
          }

          {match?.attacker == false &&
            <img src={"../../../public/factions/" + `${match?.army1}.png`} className='player2Icon'></img>
          }
          {match?.attacker == false &&
            <img src={"../../../public/factions/" + `${match?.army2}.png`} className='player1Icon'></img>
          }

          <img src={'../../../public/banner/battle1.png'} className='iconBattle1'></img>
          <img src={'../../../public/banner/battle2.png'} className='iconBattle2'></img>

        </div>

      </div>

    </div>
  );
}


export default Banner;