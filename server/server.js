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

app.get('/api/counters', async (req, res) => {
    try {
      await pool.connect();
      const result = await pool.request().query('SELECT * FROM [dbo].[counter]');
      res.json(result.recordset);
    } catch (error) {
      console.error('Error querying counter data:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      pool.close();
    }
  });

app.get('/api/cur_counters', async (req, res) => {
    try {
      await pool.connect();
      const result = await pool.request().query('SELECT * FROM [dbo].[current_counter]');
      res.json(result.recordset);
    } catch (error) {
      console.error('Error querying counter data:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      pool.close();
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});