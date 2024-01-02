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
            getAllPlayerMatches(player_nickname, callback)
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

function getAllPlayerMatches(player_nickname, callback) {

    const query = `SELECT DISTINCT M.*
    FROM Matches M
    JOIN Session S ON M.session_id = S.session_id
    JOIN Tournament T ON M.tournament_id = T.tournament_id
    JOIN Player P ON M.player1_id = P.player_id OR M.player2_id = P.player_id
    WHERE P.player_nickname = '${player_nickname}';    
    `;

    executeQuery(query, callback);
}

function handlePostRequest(event, callback) {
    postPlayerInformation(event.body, callback)
}

function acceptMatch(requestBody, callback) {
    let body = JSON.parse(requestBody)
    console.log(body)
    const query = `UPDATE Matches 
    SET is_match_played = 1
    WHERE match_id = ${body.match_id};`;
    executeQuery(query, callback);
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
