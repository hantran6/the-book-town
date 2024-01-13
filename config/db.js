const mysql = require('mysql2/promise');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
});

const ssm = new AWS.SSM();

async function getParameter(parameterName) {
    const params = {
        Name: parameterName,
        WithDecryption: true,
    };

    try {
        const result = await ssm.getParameter(params).promise();
        return result.Parameter.Value;
    } catch (error) {
        console.error(`Error retrieving parameter ${parameterName}:`, error);
        throw error;
    }
}

async function getDatabaseConfig() {
    const host = await getParameter('/booktown/dbURL');
    const user = await getParameter('/booktown/dbUsername');
    const password = await getParameter('/booktown/dbPassword');
    const database = await getParameter('/booktown/dbName');

    return {
        host,
        user,
        password,
        database,
        connectionLimit: 10,
        connectTimeout: 300,
    };
}

let pool; // Define the pool variable outside the createDatabasePool function

const createDatabasePool = async () => {
    if (!pool) { // Create the pool only if it doesn't exist
        const config = await getDatabaseConfig();
        console.log(config);
        pool = mysql.createPool(config);

        // Close the MySQL connection pool when the process receives a SIGINT signal
        process.on('SIGINT', () => {
            console.log('Received SIGINT. Closing MySQL pool...');
            pool.end()
                .then(() => {
                    console.log('MySQL pool closed successfully.');
                    process.exit();
                })
                .catch((err) => {
                    console.error('Error closing MySQL pool:', err);
                    process.exit(1);
                });
        });
    }

    return pool;
};

// Export a function that returns the pool when called
module.exports = { createDatabasePool };
