const mysql = require('mysql');
const matchGeneration = require('./matchGeneration');

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
        case 'tournamentManagement':
            handleGetTournamentRequest(event, callback)
            break;
        default:
            callback(null, buildResponse(400, { error: 'Path is wrong' }));
            break;

    }

}

function handleGetTournamentRequest(event, callback) {
    const pathSegments = event.path.split('/');
    console.log(pathSegments)
    //pathSegment[2] = tournament_id
    switch (pathSegments[3]) {
        case 'generateMatches':
            handleGenerateTournamentMatches(event.body, pathSegments[2], callback)
    }
}

function handleGenerateTournamentMatches(body, tournament_id, callback) {

    const subscriptionsToTheTournamentsQuery = `
        SELECT Subscription.*, Player.*
        FROM Player
        JOIN Subscription ON Player.player_id = Subscription.player_id
        WHERE Subscription.tournament_id = '${tournament_id}';
    `;

    const getTournamentInformationQuery = `SELECT * FROM Tournament WHERE tournament_id = '${tournament_id}';`;

    executeQuery(subscriptionsToTheTournamentsQuery, (subscriptionsToTheTournamentsErr, subscriptionsToTheTournamentsResult) => {
        if (subscriptionsToTheTournamentsErr) {
            callback(null, buildResponse(500, { error: 'Error executing MySQL query:' }));
        } else {

            const playerSubscriptions = JSON.parse(subscriptionsToTheTournamentsResult.body);
            console.log('Player Subscriptions:');
            console.log(playerSubscriptions);

            executeQuery(getTournamentInformationQuery, (getTournamentInformationErr, getTournamentInformationResult) => {
                if (getTournamentInformationErr) {
                    callback(getTournamentInformationErr, buildResponse(500, { error: 'Error fetching tournament information' }));
                } else {
                    const tournament = JSON.parse(getTournamentInformationResult.body)[0]  // Access the first element directly

                    console.log('tournament object:', tournament);

                    if (tournament.match_generation_type === "casual") {
                        let pairingSets = matchGeneration.generateMatches(playerSubscriptions, 3);
                        console.log('Generated Pairings: each element of this array, is an array of matches to be played at the same time');
                        console.log(pairingSets);
                
                        const insertQueries = [];
                        pairingSets.forEach(pairingSet => {
                            pairingSet.forEach(match => {
                                console.log(match, match.player1_id, match.player2_id);
                                const insertMatchQuery = `
                                    INSERT INTO Matches (tournament_id, session_id, player1_id, player2_id, player1_score, player2_score, player1_list, player2_list,
                                        is_match_played, game_code,  match_date, utg_player, player1_name, player2_name, match_score_acceptance, player1_army, player2_army) VALUES
                                    ('${tournament_id}', 'session1', ${match.player1_id}, ${match.player2_id}, 0, 0, '${match.player1_list}', '${match.player2_list}', 0, 'asd', '', 0, '${match.player1_name}', '${match.player2_name}', 0, '${match.player1_army}', '${match.player2_army}');
                                `;
                                insertQueries.push(insertMatchQuery);
                            });
                        });
                
                        executeQueriesInParallel(insertQueries)
                            .then(results => {
                                console.log('All insert queries executed successfully');
                                callback(null, buildResponse(200, pairingSets));
                            })
                            .catch(err => {
                                console.error('Error executing insert queries:', err);
                                callback(null, buildResponse(500, { error: 'Error executing insert queries' }));
                            });
                    } else {
                        console.log('No mode selected, exiting');
                        callback(null, buildResponse(500, { error: 'No mode selected, exiting' }));
                    }
                }
            });
        }
    });
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


function handlePostRequest(event, callback) {
    const pathSegments = event.path.split('/');
    console.log(pathSegments)
    switch (pathSegments[1]) {
        case 'tournamentSubscription':
            //pathSegments[2] is equal to the tournament id
            if(pathSegments[3] == "enrollTournament"){
                enrollPlayerToTournament(event.body, callback)
            }
        break;
    }
}

function enrollPlayerToTournament(requestBody, callback){
    let body = JSON.parse(requestBody);
    console.log(body)

    const query = `INSERT INTO Subscription 
    (tournament_id, player_id, hasPlayerPayed, player_points, lists_id, list_army, list_name, list_description) 
    VALUES ('${body.tournament_id}', '${body.player_id}', '0', '0', ${body.list_id}, '${body.list_army}', '${body.list_name}', '${body.list_description}');`

    executeQuery(query, callback);

}


