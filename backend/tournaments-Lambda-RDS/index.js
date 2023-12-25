const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE
});

// Your buildResponse function
function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
}

function executeQuery(query, callback) {
    con.query(query, function (err, result) {
        if (err) {
            console.error('Error executing MySQL query:', err);
            callback(err, buildResponse(500, { error: 'Error executing MySQL query:' }));
        }
        else {
            console.log('MySQL query result:', result);
            callback(null, buildResponse(200, result));
        }
    });
}

function handleGetTournaments(callback) {
    const tournamentsSql = "SELECT * FROM Tournament";
    executeQuery(tournamentsSql, callback);
}

function handleGetTournament(tournamentID, callback) {
    const playerSubscriptionSql = `
        SELECT Player.*, Subscription.*
        FROM Player
        JOIN Subscription ON Player.player_id = Subscription.player_id
        WHERE Subscription.tournament_id = '${tournamentID}';
    `;
    const tournamentSql = `SELECT * FROM Tournament WHERE tournament_id='${tournamentID}';`;
    const getSessionsInTournamentSql = `
    SELECT *
    FROM Session
    WHERE tournament_id = '${tournamentID}';`;

    executeQuery(tournamentSql, (tournamentErr, tournamentResult) => {
        if (tournamentErr) {
            callback(tournamentErr, buildResponse(500, { error: 'Error fetching tournament information' }));
        }
        else {
            executeQuery(playerSubscriptionSql, (playerSubscriptionErr, playerSubscriptionResult) => {
                if (playerSubscriptionErr) {
                    callback(playerSubscriptionErr, buildResponse(500, { error: 'Error fetching player subscriptions' }));
                }
                else {
                    executeQuery(getSessionsInTournamentSql, (sessionsErr, sessionsResult) => {
                        if (sessionsErr) {
                            callback(getSessionsInTournamentSql, buildResponse(500, { error: 'Error fetching sessions' }));
                        } else {
                            const tournament = JSON.parse(tournamentResult.body);
                            const playerSubscriptions = JSON.parse(playerSubscriptionResult.body);
                            const sessions = JSON.parse(sessionsResult.body);

                            const response = {
                                tournament,
                                playerSubscriptions,
                                sessions
                            };
                            callback(null, buildResponse(200, response));
                        }
                    })
                }
            }
            )
        }
    });
}

function handleGetSessionsInTournament(tournamentID, callback) {

    const getSessionsInTournamentSql = `
        SELECT *
        FROM Session
        WHERE tournament_id = '${tournamentID}';
    `;

    executeQuery(getSessionsInTournamentSql, (sessionsErr, sessionsResult) => {
        if (sessionsErr) {
            callback(sessionsErr, buildResponse(500, { error: 'Error fetching player ranking for the session' }));
        }
        else {
            const sessions = JSON.parse(sessionsResult.body);

            // Combine the results and send the response
            const response = {
                sessions
            };
            callback(null, buildResponse(200, response));
        }
    });

}

function handleGetMatchesInSession(tournamentID, sessionID, callback) {
    const matchesSql = `
        SELECT *
        FROM Matches
        WHERE tournament_id = '${tournamentID}' AND session_id = '${sessionID}' AND is_match_played = 1;
    `;

    executeQuery(matchesSql, (matchesErr, matchesResult) => {
        if (matchesErr) {
            callback(matchesErr, buildResponse(500, { error: 'Error fetching player ranking for the session' }));
        }
        else {
            const matches = JSON.parse(matchesResult.body);

            // Combine the results and send the response
            const response = {
                matches
            };
            callback(null, buildResponse(200, response));
        }
    });

}

function handleGetSession(tournamentID, sessionID, callback) {
    const sessionSql = `
        SELECT *
        FROM Session
        WHERE tournament_id = '${tournamentID}' AND session_id = '${sessionID}';
    `;

    const makePlayerRankingSessionSQL = `
        SELECT ps.player_id, p.player_nickname, SUM(ps.total_score) AS total_score, p.favourite_army
        FROM(
            SELECT player1_id AS player_id, player1_score AS total_score FROM Matches WHERE is_match_played = 1 AND session_id = '${sessionID}' AND tournament_id = '${tournamentID}'
            UNION ALL
            SELECT player2_id AS player_id, player2_score AS total_score FROM Matches WHERE is_match_played = 1 AND session_id = '${sessionID}' AND tournament_id = '${tournamentID}'
        ) AS ps
        JOIN Player p ON ps.player_id = p.player_id
        GROUP BY ps.player_id, p.player_nickname;
    `;

    executeQuery(sessionSql, (sessionErr, sessionResult) => {
        if (sessionErr) {
            callback(sessionErr, buildResponse(500, { error: 'Error fetching session information' }));
        }
        else {
            const session = JSON.parse(sessionResult.body);

            // Fetch player ranking for the specified session
            executeQuery(makePlayerRankingSessionSQL, (rankingErr, rankingResult) => {
                if (rankingErr) {
                    callback(rankingErr, buildResponse(500, { error: 'Error fetching player ranking for the session' }));
                }
                else {
                    const playerRanking = JSON.parse(rankingResult.body);

                    // Combine the results and send the response
                    const response = {
                        session,
                        playerRanking
                    };
                    callback(null, buildResponse(200, response));
                }
            });
        }
    });
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log(event)

    switch (event.httpMethod) {
        case 'GET':
            handleGetRequest(event, callback);
            break;
        case 'POST':
            handlePostRequest(event.body, callback);
            break;
        case 'OPTIONS':
            callback(null, buildResponse(200, {}));
            break;
        default:
            callback(null, buildResponse(400, { error: 'Unsupported HTTP method' }));
    }
};

function handleGetRequest(event, callback) {
    const pathSegments = event.path.split('/');
    const queryStringParameters = event.queryStringParameters;
    switch (pathSegments[1]) {
        case 'tournaments':
            handleGetTournaments(callback);
            break;
        case 'tournament':
            console.log(pathSegments)
            const tournamentID = pathSegments[2];
            if (pathSegments[2] === 'sessions') {
                const tID = event.query.tournamentID;
                handleGetSessionsInTournament(tID, callback)
            }

            // Check if there is a sessionID in the path
            if (pathSegments[3] !== '' && pathSegments.length === 4) {
                const sessionID = pathSegments[3];
                handleGetSession(tournamentID, sessionID, callback);
            }

            if (pathSegments[4] === 'getMatchesInSession' && pathSegments.length === 5) {
                const sessionID = pathSegments[3];
                handleGetMatchesInSession(tournamentID, sessionID, callback);
            }
            else {
                handleGetTournament(tournamentID, callback);
            }
            break;

        default:
            callback(null, buildResponse(404, { error: 'Not Found' }));
    }
}

function handlePostRequest(requestBody, callback) {
    const data = JSON.parse(requestBody);
    const insertSql = "INSERT INTO TableName (column1, column2) VALUES (?, ?)";

    executeQuery(insertSql, callback);
}
