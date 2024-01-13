const mysql = require('mysql2');
const AWS = require('aws-sdk');

// Configure the AWS SDK with your credentials
AWS.config.update({
    region: 'us-east-1',  // Replace with your AWS region
});

// Create an AWS SSM (Systems Manager) client
const ssm = new AWS.SSM();

// Retrieve parameters from Parameter Store
async function getParameter(parameterName) {
    const params = {
        Name: parameterName,
        WithDecryption: true,  // Decrypt the parameter value if it's encrypted
    };

    try {
        const result = await ssm.getParameter(params).promise();
        return result.Parameter.Value;
    } catch (error) {
        console.error(`Error retrieving parameter ${parameterName}:`, error);
        throw error;
    }
}

// Retrieve database connection information from Parameter Store
async function getDatabaseConfig() {
    const host = await getParameter('/booktown/dbURL');
    const user = await getParameter('/booktown/dbUser');
    const password = await getParameter('/booktown/dbPassword');
    const database = await getParameter('/booktown/dbName');

    return {
        host,
        user,
        password,
        database,
        connectionLimit: 10, 
    };
}

// Create a MySQL pool using parameters from Parameter Store
const createDatabasePool = async () => {
    const config = await getDatabaseConfig();
    return mysql.createPool(config);
};

// Handle errors
const pool = createDatabasePool();
pool.on('error', (err) => {
    console.error('MySQL pool error:', err);
});

// Close the connection when done
process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing MySQL pool...');
    
    // Close the MySQL connection pool
    pool.end((err) => {
        if (err) {
            console.error('Error closing MySQL pool:', err);
        } else {
            console.log('MySQL pool closed successfully.');
        }

        // Exit the process
        process.exit();
    });
});

module.exports = pool;
