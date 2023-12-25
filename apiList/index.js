const apiPaths = {
    tournamentsAPIEndpoint: 'https://nfjacuia4f.execute-api.eu-west-3.amazonaws.com/dev',
    playersAPIEndpoint: 'https://wwhlvoay4l.execute-api.eu-west-3.amazonaws.com/dev',
    matchesAPIEndpoint: 'https://jzm37zyilc.execute-api.eu-west-3.amazonaws.com/dev',

    getSessionsInTournament: '/tournament/getSessionsInTournament',
    getMatchesInSession: '/tournament/getMatchesInSession',
    player: '/player', // /player_nickname
    acceptMatch: '/acceptMatch',
    refuseMatch: '/refuseMatch',
    insertScore: '/insertScore',
    getMatch: '/match'
  

  }

export default apiPaths;