const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'book_db',
    connectionLimit: 10, // Adjust as needed
});

// Handle errors
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