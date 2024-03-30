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

app.get('/api/counter1', async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query("SELECT * FROM [dbo].[counter] WHERE counter_id = 1 AND record_time > '2024-03-27 00:00:00.000'");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error querying counter data:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    pool.close();
  }
});

app.get('/api/counter2', async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query("SELECT * FROM [dbo].[counter] WHERE counter_id = 2 AND record_time > '2024-03-27 00:00:00.000'");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error querying counter data:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    pool.close();
  }
});

app.get('/api/counters', async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query("SELECT * FROM [dbo].[counter] WHERE record_time > '2024-03-27 00:00:00.000'");
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
      const result = await pool.request().query("SELECT * FROM [dbo].[current_counter] WHERE record_time > '2024-03-27 00:00:00.000'");
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