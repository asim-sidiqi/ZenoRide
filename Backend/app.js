const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const userRoutes = require('./routes/user.routes')
dotenv.config();

const connectToDb = require('./db/db')
connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended:true} ) )

app.get('/',(req,res)=>{
    res.send('hi');
});

app.use('/users', userRoutes)

module.exports = app;
