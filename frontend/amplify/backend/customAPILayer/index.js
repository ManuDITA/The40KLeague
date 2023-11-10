const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-west-3'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbSessionTable = 'SessionsTable';
const dynamodbSeasonTable = 'SeasonsTable';

const sessionPathFromSeason = '/season/{seasonID}/session/{sessionID}'
const sessionsPathFromSeason = '/season/{seasonID}/sessions';
const singleSeasonPath = '/season/{seasonID}';
const seasonsPath = '/seasons';



exports.handler = async function(event) {
    let response;
    switch (true) {

        //Seasons
        case event.httpMethod === 'GET' && event.path === seasonsPath:
            response = await getSeasons();
            break;

        case event.httpMethod === 'GET' && event.resource === singleSeasonPath:
            console.log("Entered in the single season case")
            response = await getSeason(event.pathParameters.seasonID);
            break;

        case event.httpMethod === 'GET' && event.resource === sessionsPathFromSeason:
            response = await getSessionsFromSeason(event.pathParameters.seasonID);
            break;

        case event.httpMethod === 'GET' && event.resource === sessionPathFromSeason:
            response = await getSessionInSeason(event.pathParameters.seasonID, event.pathParameters.sessionID);
            break;

        default:
            response = buildResponse(404, event);
    }
    return response;
}

async function getSeason(seasonID) {
    const params = {
        TableName: dynamodbSeasonTable,
        Key: {
            'seasonID': seasonID
        }
    };

    try {
        const response = await dynamodb.get(params).promise();
        if (response.Item) {
            return buildResponse(200, response.Item);
        }
        else {
            return buildResponse(404, 'Season not found');
        }
    }
    catch (error) {
        console.error('Error:', error);
        return buildResponse(500, 'Internal Server Error');
    }
}

async function getSeasons() {
    const params = {
        TableName: dynamodbSeasonTable
    }
    const allSeasons = await scanDynamoRecords(params, []);
    const body = {
        seasons: allSeasons
    }
    return buildResponse(200, body);
}

async function getSessionsFromSeason(seasonID) {
    const params = {
        TableName: dynamodbSessionTable,
        KeyConditionExpression: 'seasonID = :seasonID',
        ExpressionAttributeValues: {
            ':seasonID': seasonID
        }
    };

    try {
        const response = await dynamodb.query(params).promise();
        if (response.Items) {
            return buildResponse(200, response.Items);
        }
        else {
            return buildResponse(404, response);
        }
    }
    catch (error) {
        console.error('Error:', error);
        return buildResponse(500, 'Internal Server Error');
    }
}

async function getSessionInSeason(seasonID, sessionID) {
    const params = {
        TableName: dynamodbSessionTable,
        KeyConditionExpression: 'seasonID = :seasonID AND sessionID = :sessionID',
        ExpressionAttributeValues: {
            ':seasonID': seasonID,
            ':sessionID': sessionID,
        }
    };

    try {
        const response = await dynamodb.query(params).promise();
        if (response.Items[0]) {
            return buildResponse(200, response.Items[0]);
        }
        else {
            return buildResponse(404, response);
        }
    }
    catch (error) {
        console.error('Error:', error);
        return buildResponse(500, 'Internal Server Error');
    }
}

async function scanDynamoRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey) {
            scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    }
    catch (error) {
        console.error('Do your custom error handling here. I am just gonna log it: ', error);
    }
}

async function saveProduct(requestBody) {
    const params = {
        TableName: dynamodbSeasonTable,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
}

async function modifyProduct(productId, updateKey, updateValue) {
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'productId': productId
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            UpdatedAttributes: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
}

async function deleteProduct(productId) {
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'productId': productId
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
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
