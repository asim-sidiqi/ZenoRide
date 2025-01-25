const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config();

const connectToDb = require('./db/db')
connectToDb();

app.use(cors());

app.get('/',(req,res)=>{
    res.send('hi');
});

module.exports = app;
