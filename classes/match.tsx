export class Match {

    match_id: number;
    session_id: string;
    tournament_id: string;

    
    player1_id: number
    player1_name: string;
    player1_score: number
    player1_army: string;
    player1_list: string

    player2_id: number
    player2_name: string;
    player2_score: number;
    player2_army: string;
    player2_list: string

    is_match_played: any;
    game_code: string;
    match_date: string;
    utg_player: number;
    is_player1_attacker: number;

    /*constructor(player1: string, player2: string, attacker: boolean, gameCode: string, army1: string, army2: string, score: string, gameType: string, statusPlayed: string, utgPlayer: string) {
        this.player1 = player1;
        this.player2 = player2;
        this.gameCode = gameCode;
        this.army1 = army1;
        this.army2 = army2;
        this.score = score;
        this.gameType = gameType;
        this.statusPlayed = statusPlayed;

        this.utgPlayer = utgPlayer;

        this.attacker = attacker;

    }*/
}