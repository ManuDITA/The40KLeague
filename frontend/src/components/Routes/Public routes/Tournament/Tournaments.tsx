import React, { FC, useEffect, useState } from 'react';
import './Tournament.css'
import { Session } from '../../../../../../classes/Session';
import { Link } from 'react-router-dom';
import { TournamentClass } from '../../../../../../classes/TournamentClass';
import apiPaths from '../../../../../../apiList';
import TournamentBanner from '../../../Banner/TournamentBanner';

interface TournamentsProps { }

const Tournaments: FC<TournamentsProps> = () => {
    const [tournaments, setTournaments] = useState<TournamentClass[]>([]);

    useEffect(() => {
        console.log(window.location.pathname);

        fetch(apiPaths.tournamentsAPIEndpoint + '/tournaments')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // Ensure data is an array before setting the state
                if (Array.isArray(data as TournamentClass[])) {
                    setTournaments(data);
                } else {
                    console.error('Received non-array data for tournaments:', data);
                }
            })
    }, []);

    return (
        <div className='pt-10'>
            <div className='green40k'>Tournaments</div>
            {tournaments.map((tournament) => (
                <TournamentBanner key={tournament.tournament_id} tournament={tournament}/>
            ))}
        </div>
    );
}

export default Tournaments;
