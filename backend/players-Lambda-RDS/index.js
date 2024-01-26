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
    console.log(query)
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

    console.log('After query')
}

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    switch (event.httpMethod) {
        case 'GET':
            handleGetRequest(event, callback);
            break;
        case 'POST':
            handlePostRequest(event, callback);
            break;
        case 'PATCH':
            handlePatchRequest(event, callback);
        case 'OPTIONS':
            //callback(null, buildResponse(200, {}));
            break;
        default:
            callback(null, buildResponse(400, { error: 'Unsupported HTTP method' }));
    }
};

function handleGetRequest(event, callback) {
    const pathSegments = event.path.split('/');
    console.log(pathSegments)
    switch (pathSegments[1]) {
        case 'player':
            const player_nickname = pathSegments[2];
            if (pathSegments[3] == undefined) {
                getPlayerInfo(player_nickname, callback);
            } else {
                switch (pathSegments[3]) {
                    case 'lists':
                        getPlayerLists(player_nickname, callback);
                        break;

                    case 'id':
                        getPlayerId(player_nickname, callback);

                    default:
                        break;
                }

            }
            break;
        case 'match':
            const match_id = pathSegments[2];
            getMatch(match_id, callback);
            break;
        default:
            callback(null, buildResponse(400, { error: 'Path is wrong' }));
            break;

    }

}

function getMatch(match_id, callback) {
    const query = `SELECT * FROM Matches WHERE match_id = ${match_id};`;
    executeQuery(query, callback);
}

function getPlayerId(player_nickname, callback){
    const query = `SELECT Player.player_id FROM Player WHERE player_nickname = '${player_nickname}';`;
    executeQuery(query, callback);
}

function handlePatchRequest(event, callback) {
    const pathSegments = event.path.split('/');
    console.log(pathSegments)
    switch (pathSegments[1]) {
        case 'acceptMatch':
            acceptMatch(event.body, callback)
            break;

        case 'refuseMatch':
            refuseMatch(event.body, callback)
            break;

        case 'insertScore':
            insertScore(event.body, callback)
            break;

        default:
            callback(null, buildResponse(400, { error: 'Path is wrong' }));
            break;

    }

}

function getPlayerInfo(player_nickname, callback) {

    const playerMatchesSQL = `SELECT DISTINCT M.*
    FROM Matches M
    JOIN Session S ON M.session_id = S.session_id
    JOIN Tournament T ON M.tournament_id = T.tournament_id
    JOIN Player P ON M.player1_id = P.player_id OR M.player2_id = P.player_id
    WHERE P.player_nickname = '${player_nickname}';    
    `;

    const enrolledTournaments = `
    SELECT Subscription.*, Tournament.*, Player.*
    FROM Subscription
    JOIN Tournament ON Subscription.tournament_id = Tournament.tournament_id
    JOIN Player ON Subscription.player_id = Player.player_id
    WHERE Player.player_nickname = '${player_nickname}';    
    `;

    executeQuery(enrolledTournaments, (enrolledTournamentsErr, enrolledTournamentsResult) => {
        if (enrolledTournamentsErr) {
            callback(enrolledTournamentsErr, buildResponse(500, { error: 'Error fetching tournament subscriptions' }));
        }
        else {
            const tournaments = JSON.parse(enrolledTournamentsResult.body);

            // Fetch player ranking for the specified session
            executeQuery(playerMatchesSQL, (playerMatchesErr, playerMatchesRes) => {
                if (playerMatchesErr) {
                    callback(playerMatchesErr, buildResponse(500, { error: 'Error fetching player matches' }));
                }
                else {
                    const matches = JSON.parse(playerMatchesRes.body);

                    // Combine the results and send the response
                    const response = {
                        tournaments,
                        matches
                    };
                    callback(null, buildResponse(200, response));
                }
            });
        }
    });

}

function handlePostRequest(event, callback) {
    console.log('Handling post requests')
    const pathSegments = event.path.split('/');
    console.log(pathSegments)
    if (pathSegments[2] == undefined) {
        //create a player
        console.log('Handling post player info')
        postPlayerInformation(event.body, callback)
    }
    switch (pathSegments[3]) {
        case 'list':
            console.log('Handling post list request')
            //adding a list to the player list database
            postList(event.body, callback)
            break;
        default:

    }
}

function executeQueriesInParallel(queries) {
    return Promise.all(queries.map(query => {
        return new Promise((resolve, reject) => {
            con.query(query, (err, result) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    reject(err);
                } else {
                    console.log('MySQL query result:', result);
                    resolve(result);
                }
            });
        });
    }));
}

function updatePlayerScore(tournamentId, playerId, newScore) {
    const query = `UPDATE Subscription
                   SET player_points = player_points + ${newScore}
                   WHERE tournament_id = '${tournamentId}'
                   AND player_id = ${playerId};`;

                   console.log('Updating player score:' , query)

    return query;
}

function updateMatchStatus(matchId) {
    const query = `UPDATE Matches 
                   SET is_match_played = 1
                   WHERE match_id = ${matchId};`;

    return query;
}

function acceptMatch(requestBody, callback) {
    let body = JSON.parse(requestBody);
    console.log(body);

    const tournamentId = body.tournament_id; // Replace with actual tournament ID
    const player1Id = body.player1_id;
    const player2Id = body.player2_id;
    const matchId = body.match_id;
    const player1_score = body.player1_score
    const player2_score = body.player2_score

    const queries = [
        updatePlayerScore(tournamentId, player1Id, player1_score),
        updatePlayerScore(tournamentId, player2Id, player2_score),
        updateMatchStatus(matchId) // Add the match update query
    ];

    executeQueriesInParallel(queries)
        .then(results => {
            callback(null, buildResponse(200, results));
        })
        .catch(err => {
            callback(err, buildResponse(500, { error: 'Error executing MySQL queries' }));
        });
}

function refuseMatch(requestBody, callback) {
    let body = JSON.parse(requestBody)
    console.log(body)
    const query = `UPDATE Matches 
    SET match_score_acceptance = 0, player1_score = 0, player2_score = 0
    WHERE match_id = ${body.match_id};`;
    executeQuery(query, callback);
}

function insertScore(requestBody, callback) {
    let body = JSON.parse(requestBody)
    console.log(body)
    const query = `UPDATE Matches 
    SET match_score_acceptance = ${body.match_score_acceptance}, player1_score = ${body.player1_score}, player2_score = ${body.player2_score}, match_date = '${body.match_date}'
    WHERE match_id = ${body.match_id};`;
    executeQuery(query, callback);
}

function getPlayerLists(player_nickname, callback) {
    const query = `SELECT Lists.*
    FROM Lists
    JOIN Player ON Lists.player_id = Player.player_id
    WHERE Player.player_nickname = '${player_nickname}';`;
    executeQuery(query, callback);
}

function postList(passedBody, callback) {
    let body = JSON.parse(passedBody)
    console.log(body)
    const query = `INSERT INTO Lists (player_id, list_description, list_army, list_name, is_archived, list_points) VALUES (${body.player_id}, '${body.list_description}', '${body.list_army}', '${body.list_name}', 0, ${body.list_points});`;
    executeQuery(query, callback);
}

/*player_id
player_nickname
player_email
player_phone_number
favourite_army
player_birthdate*/

function postPlayerInformation(requestBody, callback) {
    let body = JSON.parse(requestBody)
    console.log(body)
    const query = `INSERT INTO Player (player_nickname, player_email, player_phone_number, player_birthdate, player_name) VALUES 
    ('${body.username}', '${body.email}', '${body.phone_number}', '${body.birthdate}', '${body.name}');`;
    executeQuery(query, callback);
}
