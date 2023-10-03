require('dotenv').config()
const express=require('express')
const cors=require('cors')
const connection =require('./DbConnection/db')
const userRoute=require('./routes/usersRoute')
const logger=require('./util/logger')
const cron=require('node-cron')

connection()

const app=express()
app.use(express.json())
app.use(cors())

app.use("/api", userRoute);


app.listen(3001,()=>{
    logger.info('Server is running at 3001')
})