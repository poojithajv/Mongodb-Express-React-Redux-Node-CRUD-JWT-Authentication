const {createLogger,transports,format}=require('winston')
require('winston-mongodb')
const logger=createLogger({
    transports:[
        new transports.File({
            filename:'messages.log',
            level:'info',
            format:format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename:'erromessages.log',
            level:'error',
            format:format.combine(format.timestamp(),format.json())
        }),
        new transports.MongoDB({
            level:'info',
            collection:'logs',
            db:process.env.DBURL,
            format:format.combine(format.timestamp(),format.json())
        })
    ]
})
module.exports=logger