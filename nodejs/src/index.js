const express = require('express');
const pg = require('pg');

const client = new pg.Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOSTNAME,
    database: process.env.DB_DATABASE,
});
const app = express();
client.connect();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'hello world' });
});

app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Database BORK!' });
        }
        res.status(200).json(result.rows);
    });
});

app.listen(8000);
