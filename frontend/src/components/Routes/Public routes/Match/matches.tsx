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
        <div>
            {match != undefined &&
                <div>
                    {match?.player1_list}
                    <Banner prop={match} canBeModified={false}  ></Banner>

                    {match?.player2_list}

                    <h1 className="text-3xl font-bold underline">
                        Hello world!
                    </h1>
                </div>


            }
        </div>
    );
}

export default Matches;
