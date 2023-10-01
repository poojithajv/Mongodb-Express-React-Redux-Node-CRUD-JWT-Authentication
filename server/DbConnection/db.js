const mongoose=require('mongoose')
const logger =require('../util/logger')

module.exports=async()=>{
    const connectionParams={
        useNewUrlParser:true,
        useUnifiedTopology:true
    };
    try{
        const connect = await mongoose.connect(process.env.DBURL,connectionParams);
        logger.info('Connected to database successfully')
    }catch(error){
        logger.error("couldn't connect to database")
    }
}