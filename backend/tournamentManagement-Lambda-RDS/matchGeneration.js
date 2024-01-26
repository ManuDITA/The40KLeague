function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateMatches(players, m) {
    if (players.length % 2 !== 0) {
        console.log("Number of players must be even for 1v1 matches.");
        return;
    }

    const matches = [];

    for (let round = 1; round <= m; round++) {
        shuffle(players); // Shuffle the players array for each round

        const roundMatches = [];

        for (let i = 0; i < players.length / 2; i++) {

            const player1 = players[i];
            const player2 = players[players.length / 2 + i];

            const match = {
                session_id: 'session1',
                tournament_id: player1.tournament_id,
            
                
                player1_id: player1.player_id,
                player1_name: player1.player_nickname,
                player1_score: 0,
                player1_army: 'Orks',
                player1_list:  '',
            
                player2_id: player2.player_id,
                player2_name: player2.player_nickname,
                player2_score: 0,
                player2_army: 'Space Marines',
                player2_list:  '',
            
                is_match_played: 0,
                game_code: 'asd' + player1.player_id + player2.player_id,
                match_date: '',
                utg_player: 0,
                //if 0, no one proposed a match score
                //if 1, player1 proposed a match score
                //if 2, player2 proposed a match score
                match_score_acceptance: 0
            }
            roundMatches.push(match);
        }

        matches.push(roundMatches);
    }

    return matches;
}


module.exports = {
    generateMatches
    // Export other functions if needed
};