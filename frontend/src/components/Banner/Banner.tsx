import './banner.css'
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { Match } from '../../../../classes/match';

function Banner(prop: any) {

  const [match, setMatch] = useState<Match | undefined>();
  const [date, setDate] = useState<string | undefined>();
  const divRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    // Your effect logic here
    // For example, if you want to update player names and icons when 'prop' changes:

    const inputDate = new Date(prop.prop.match_date);
    prop.prop.match_date = `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`;
    if(prop.prop.match_date == '1/1/1970'){
      prop.prop.match_date = 'N/A'
    }
    console.log(prop.prop)
    setMatch(prop.prop);


  }, [prop]);

  useEffect(() => {

    //console.log(match)

  }, [match])


  return (

    <span >
      {/*match?.score == undefined &&
        <></>
  */}
      {match?.match_id}

      <div className='rectangle' ref={divRef}>
        <div className='innerRectangle'>


          {match?.utg_player == 1 &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon1'></img>
          }

          {match?.utg_player == 2 &&
            <img src={"../../../public/banner/Img_UTG_Logo.png"} className='utgIcon2'></img>
          }


          <div className='score'>
            {match?.player1_score == 0 && match?.player2_score == 0 && '. – .'}
            {match?.player1_score != undefined && match.player1_score} - {match?.player2_score != undefined && match.player2_score}
          </div>

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

    </span>
  );
}


export default Banner;