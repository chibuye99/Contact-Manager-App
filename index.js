const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const connectDb = require('./config/dbconnection')
const dotenv = require('dotenv').config()

connectDb();

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use("/api/contacts",require("./routes/contactRoutes"));
app.use("/api/users",require("./routes/userRoutes"))
app.use(errorHandler);

app.listen(PORT,(request,response)=>{
    console.log(`Listening on http://localhost:${PORT}`)
})