const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user.routes')
const captainRoutes = require('./routes/captain.routes')
dotenv.config();

const connectToDb = require('./db/db')
connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended:true} ) )
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('hi');
});

app.use('/users', userRoutes)
app.use('/captains', captainRoutes)

module.exports = app;
