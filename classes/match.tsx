class Match{

    player1: string;
    player2: string;
    gameCode: string;
    army1: string;
    army2: string;
    score: string;
    gameType: string;
    statusPlayed: any;

    utgPlayer: string;

    attacker: boolean;

    constructor(player1: string, player2: string, attacker: boolean, gameCode: string, army1:string, army2:string, score:string, gameType:string, statusPlayed:string, utgPlayer: string){
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

    }
}

export { Match }