import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { MdCalendarMonth } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { TournamentClass } from '../../../../classes/TournamentClass';
import { FaTrophy } from "react-icons/fa";

const TournamentBanner = ({ tournament }: { tournament: TournamentClass }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');


    function formatDate(inputDate) {
        const date = new Date(inputDate);

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const dayOfWeek = daysOfWeek[date.getUTCDay()];
        const month = date.getUTCMonth() + 1
        const day = date.getUTCDate();
        const year = date.getUTCFullYear().toString().substr(-2);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');

        return `${dayOfWeek}, ${day}/${month}/${year} ${hours}:${minutes}`;
    }

    useEffect(() => {
        setStartDate(formatDate(tournament.start_date));
        setEndDate(formatDate(tournament.end_date));
    }, [tournament]);

    const navigate = useNavigate();

    return (
        <div className='mx-4 flex flex-row items-center'>
            <FaTrophy className='text-black40k text-7xl'/>
            <div className="w-full bg-white my-1 mx-4 border-2 border-black40k rounded-lg h-24 hover:cursor-pointer flex flex-row items-center justify-start" onClick={() => navigate('/tournament/' + tournament.tournament_id)}>
                <div className="basis-2/12 ml-4">
                    <div className="text-4xl"><MdCalendarMonth></MdCalendarMonth></div>
                    <div className='text-slate-600 font-light text-sm'>
                        <div>{startDate}</div>
                        <div>{endDate}</div>
                    </div>
                </div>
                <div className="text-green40k font-arial-black font-bold text-2xl basis-1/2">
                    {tournament.tournament_name}
                </div>

                <div className="basis-1/6">
                    {tournament.location}
                </div>

                <div className="flex-col flex ml-auto mx-10">
                    <div className="flex-grow flex items-center mx-4">
                        <FaUsers className="text-black40k text-4xl" />
                        <div className="text-green40k text-2xl font-bold">
                            {tournament.max_player_count}/{tournament.max_player_count}
                        </div>
                    </div>

                    <div className="my-2 flex flex-row items-center text-nowrap">
                        <div className="bg-black40klight text-white40k p-2 rounded-2xl flex items-center justify-center">
                            3000 Points
                        </div>
                        <div className="ml-2">5 games</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentBanner;
