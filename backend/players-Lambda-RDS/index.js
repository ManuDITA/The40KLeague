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
            postPlayerInformation(event.body, callback)
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
            const tournamentID = pathSegments[2];
            if (pathSegments[3] !== '' && pathSegments.length === 4) {
                // Check if there is a sessionID in the path
                const sessionID = pathSegments[3];
                handleGetSession(tournamentID, sessionID, callback);
            }
            else {
                handleGetTournament(tournamentID, callback);
            }
            break;
        default:
            callback(null, buildResponse(404, { error: 'Not Found' }));
    }
}


/*player_id
player_nickname
player_email
player_phone_number
favourite_army
player_birthdate*/

function postPlayerInformation(requestBody, callback) {
    body = JSON.parse(requestBody)
    console.log(body)
    const query = `INSERT INTO Player (player_nickname, player_email, player_phone_number, player_birthdate, player_name) VALUES 
    ('${body.username}', '${body.email}', '${body.phone_number}', '${body.birthdate}', '${body.name}');`;
    executeQuery(query, callback);
}
