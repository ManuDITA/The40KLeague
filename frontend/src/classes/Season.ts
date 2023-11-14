
export  class SeasonClass {

    seasonID!: string;
    sessionID!: string;
    sessionImageLocation: string;
    playerRanking: any;

    seasonName: string;
    seasonDescription: string;
    seasonRanking: any;


    
    sessionName: string;
    sessionImage: string;
    sessionPrefix: string;
    sessionPostfix: number;
    isSessionOngoing: boolean;
    players: any[];
    matches: any[];
    sessionTime: any;
    sessionStartDate: Date;
    sessionEndDate: Date;
}