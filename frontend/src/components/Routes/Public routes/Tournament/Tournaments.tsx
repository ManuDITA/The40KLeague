import React, { FC, useEffect, useState } from 'react';
import './Tournament.css'
import { Session } from '../../../../../../classes/Session';
import { Link } from 'react-router-dom';
import { TournamentClass } from '../../../../../../classes/TournamentClass';
import apiPaths from '../../../../../../apiList';

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
        <div>
            {tournaments.map((tournament) => (
                <div key={tournament.tournament_id}>
                    <h3>{tournament.tournament_id}</h3>
                    {/* Render other tournament details as needed */}
                    <Link to={`/tournament/${tournament.tournament_id}`}>View Details</Link>
                </div>
            ))}
        </div>
    );
}

export default Tournaments;
