const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user.routes')
const captainRoutes = require('./routes/captain.routes')
const mapsRoutes = require('./routes/maps.routes')
const rideRoutes = require('./routes/ride.routes');
dotenv.config();

const connectToDb = require('./db/db')
connectToDb();

// const allowedOrigins = [
//   'https://zeno-ride-vite.vercel.app',  // Replace this with your real frontend deployed link
//   'http://localhost:5173'              // Keep for local testing
// ];

app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded( {extended:true} ) )
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('hi');
});

app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/maps', mapsRoutes)
app.use('/rides', rideRoutes);

module.exports = app;

