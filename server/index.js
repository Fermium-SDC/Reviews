require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes');

const db = require('./db');

const app = express();
//cors pool

app.use(express.json());
app.use(cors());
app.use('/', router);


app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);
