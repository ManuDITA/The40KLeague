import React, { FC, useEffect, useState } from 'react';
import { Session } from '../../../../../../classes/Session';
import { Link } from 'react-router-dom';
import apiPaths from '../../../../../../apiList';
import Banner from '../../../Banner/Banner';
import { Match } from '../../../../../../classes/match';

interface MatchesProps { }

const Matches: FC<MatchesProps> = () => {

    const [match, setMatch] = useState<Match>();

    console.log(apiPaths.matchesAPIEndpoint + window.location.pathname)

    useEffect(() => {
        fetch(apiPaths.matchesAPIEndpoint + window.location.pathname)
            .then((res) => res.json())
            .then((data) => {
                console.log('Visualizing match: ', data[0]);
                setMatch(data[0]);
            })
    }, [])


    return (
        <>
            {match != undefined &&
                <>
                    <div className='text-center text-5xl font-bold text-customBlue pt-10'>Match {match?.match_id}</div>
                    <div className='container grid grid-cols-3 grid-rows-2 justify-items-center mx-auto mb-16'>
                        <img className='row-span-2 justify-self-end' src='/player_icon.avif'></img>
                        <div className='row-span-1 self-end text-maxFont text-zinc-500 font-extrabold'>VS</div>
                        <img className='row-span-2 justify-self-start' src='/player_icon.avif'></img>

                        <div className='col-start-2 self-center'>
                            <Banner prop={match} canBeModified={false}  ></Banner>
                        </div>
                    </div>

                    <div className='boldBlue'>Listes:</div>
                    <div className="container flex flex-row items-center mx-auto px-10">
                        <div className='w-6/12 px-10'>
                            <div>Attacker</div>
                            <pre className='text-left text-red-500  h-80  overflow-scroll overflow-x-hidden border-1 border-black'>{match?.player1_list}</pre>
                        </div>
                        <div className="w-6/12 px-10">
                            <div>Defender</div>
                            <pre className='text-left text-blue-500 h-80  justify-self-start w-full col-start-3 overflow-scroll overflow-x-hidden border-1 border-black'>{match?.player2_list}</pre>
                        </div>
                    </div>
                </>

            }
        </>
    );
}

export default Matches;
