const AWS = require('aws-sdk');
const User = require('../../frontend/src/classes/UserClass'
)

AWS.config.update({
    region: 'eu-west-3'
});


//ASDDDDD
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbUsersTable = 'UsersTable';
const dynamodbSessionsTable = 'SessionsTable';

const userPath = '/user/{nickname}'

exports.handler = async function(event) {
    let response;
    switch (true) {
        //User
        case event.httpMethod === 'GET' && event.resource === userPath:
            
            const cognitoUserID = event.queryStringParameters.cognitoUserID;
            response = await getUser(event.pathParameters.nickname, cognitoUserID);
            break;

        default:
            response = buildResponse(404, event);
    }
    return response;
}

async function getUser(nickname, cognitoUserID) {
    const params = {
        TableName: dynamodbUsersTable,
        KeyConditionExpression: 'nickname = :nickname AND cognitoUserID = :cognitoUserID',
        ExpressionAttributeValues: {
            ':nickname': nickname,
            ':cognitoUserID': cognitoUserID
        }
    };

    try {
        const response = await dynamodb.query(params).promise();
        if (response.Items) {
            const sessionObject = await getCurrentActiveSession();
            const obj = {
                user: response.Items[0],
                session: sessionObject
            };
            return buildResponse(200, obj);
        } else {
            return buildResponse(404, response);
        }
    } catch (error) {
        console.error('Error:', error);
        return buildResponse(500, 'Internal Server Error');
    }
}

async function getCurrentActiveSession() {
    return new Promise((resolve, reject) => {
        // Define the parameters for the query
        const params = {
            TableName: dynamodbSessionsTable,
            IndexName: 'isSessionOngoingindex', // Specify the index name
            KeyConditionExpression: 'isSessionOngoing = :value', // Query condition
            ExpressionAttributeValues: {
                ':value': 'true'
            },
        };

        // Perform the query
        dynamodb.query(params, (err, data) => {
            if (err) {
                console.error('Error querying DynamoDB:', err);
                reject(err);
            } else {
                console.log('Query result:', data.Items);
                resolve(data.Items);
            }
        });
    });
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}
