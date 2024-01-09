const mysql = require('mysql');
const AWS = require('aws-sdk');

// Create an instance of the AWS SDK
const ssm = new AWS.SSM();

// Function to fetch database configuration from Parameter Store
async function getDatabaseConfig() {
    const parameterName = '/MyWebsite/DBConnectionString';

    try {
        const response = await ssm.getParameter({ Name: parameterName, WithDecryption: true }).promise();
        return JSON.parse(response.Parameter.Value);
    } catch (error) {
        console.error('Error retrieving database config from Parameter Store:', error);
        throw error;
    }
}

// Use the function to get the database configuration
const dbConfig = await getDatabaseConfig();

// Create a connection pool with the obtained database configuration
const pool = mysql.createPool(dbConfig);

module.exports = pool;
