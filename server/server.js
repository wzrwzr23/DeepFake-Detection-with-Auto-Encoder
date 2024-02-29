const express = require('express');
const mssql = require('mssql');

const app = express();
const PORT = process.env.PORT || 5001;

// Replace the connection string with your Azure SQL Database connection string
const config = {
    user: 'Zhuoran',
    password: 'aA!12345',
    server: 'capssqlserverdemo.database.windows.net',
    database: 'sqldb',
    options: {
      encrypt: true,
      enableArithAbort: true,
    },
  };

// Create a pool of database connections
const pool = new mssql.ConnectionPool(config);

app.get('/api/data', async (req, res) => {
  try {
    // Connect to the database
    await pool.connect();

    // Query the database (replace with your own query)
    const result = await pool.request().query('SELECT * FROM [dbo].[counter]');

    // Send the result as JSON
    res.json(result.recordset);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the database connection
    pool.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
