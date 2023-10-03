const jwt = require('jsonwebtoken')
const mongoose=require('mongoose')
const Joi=require('joi')
const passwordComplexity=require('joi-password-complexity')

const UserSchema=new mongoose.Schema({
    userId:{type:String},
    userName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    mobileNo:{type:Number,required:true},
    altMobileNo:{type:Number,required:true},
    age:{type:Number,required:true}
}, { timeStamps: true })

UserSchema.pre('save', async function (next) {
    if (!this.isNew) {
      return next();
    }
    try {
      const highestUserIdDocument = await this.constructor.findOne({}, { userId: 1 }, { sort: { userId: -1 } });
      let nextUserId = 1;
      if (highestUserIdDocument && highestUserIdDocument.userId) {
        nextUserId = parseInt(highestUserIdDocument.userId.slice(5,)) + 1;
      }
      console.log(1,nextUserId)
      const formattedUserId = nextUserId.toString().padStart(4, '0');
      this.userId = 'user_'+formattedUserId;
      next();
    } catch (error) {
      next(error);
    }
  });

const UserModel=mongoose.model("All Users",UserSchema)



const validate1=(data)=>{
        const schema=Joi.object({
            userName:Joi.string().required().label("User Name"),
            email:Joi.string().required().label("Email"),
            password:passwordComplexity().required().label("Password"),
            mobileNo:Joi.number().required().label('Mobile Number'),
            altMobileNo:Joi.number().required().label('Alternate Mobile Number'),
            age:Joi.number().required().label('Age'),

        })
        return schema.validate(data)
}
const validate2=(data)=>{
    const schema=Joi.object({
        email:Joi.string().required().label("Email"),
        password:passwordComplexity().required().label("Password")
    })
    return schema.validate(data)
}
module.exports={UserModel,validate1,validate2}