const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger=require('../util/logger')
const {UserModel,validate1,validate2} = require("../model/UserModel");

// register a user
const registerUser = asyncHandler(async (req, res) => {
    try{
        const {error}=validate1(req.body)
        if (error){
            logger.error({message:error.details[0].message})
            return res.status(400).send({message:error.details[0].message})
        }
        const user=await UserModel.findOne({email:req.body.email})
        if (user){
            logger.error("User with given email already exists")
            return res.status(409).send({message:"User with given email already exists"})
        }
        const salt=await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword=await bcrypt.hash(req.body.password,salt)
        await new UserModel({...req.body,password:hashPassword}).save()
        logger.info("User Created Successfully")
        return res.status(201).send({message:"User Created Successfully"})
        
    }catch(error){
        logger.error("Internal Server Error")
        return res.status(500).send({message:'Internal Server Error'})
    }
});

// login a user
const loginUser = asyncHandler(async (req, res) => {
    try{
        const {email,password}=req.body
        const {error}=validate2(req.body)
        if (error){
            logger.error({message:error.details[0].message})
            return res.status(400).send({message:error.details[0].message})
        }
        const user=await UserModel.findOne({email})
        if (!user){
            logger.error("Invalid Email ")
            return res.status(401).send({message:"Invalid Email "})
        }
        const validPassword=await bcrypt.compare(password,user.password)
        if (!validPassword){
            logger.error('Invalid Password')
            return res.status(401).send({message:"Invalid Password"})
        }
        const token=jwt.sign({
            user: {
                userName: user.userName,
                email: user.email,
                id: user.id,
            },
            },process.env.JWTSECRETKEY,{expiresIn:"7d"})
            logger.info('Logged in successfully')
        res.status(200).send({accessToken:token,message:"Logged in successfully"})
        return
    }catch(error){
        logger.error("Internal Server Error")
        res.status(500).send({message:'Internal Server Error'})
        return
    }
});

// check a user
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// Get all users
const getallusers = asyncHandler(async (req,res)=>{
    try{
        const users = await UserModel.find()
        if (users){
            logger.info("All users are retrieved")
            return res.json({users:users})
            
        }
    }catch(error){
        logger.error("All users are not retrieved")
        return res.json({message:error})
    }
    
})
  
// get a user by id
const getuser = asyncHandler(async (req, res) => {
    try{
    const user = await UserModel.findById(req.params.id);
    if (!user) {
        logger.error('user not found')
        res.status(404).send({message:"user not found"})
        return 
    }
        logger.info('User retreived successfully')
        res.status(200).json(user);
        return 
    }
    catch(err){
        logger.error("Internal Server Error")
        return res.json(err)
    }
});

// update a user
const updateuser = asyncHandler(async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            logger.error('user not found')
            res.status(404).send({message:"user not found"})
            return 
        }

    // if (user.email !== req.user.email) {
    //   res.status(403);
    //   throw new Error("User don't have permission to update other users");
    // }

    const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    logger.info('user updated successfully')
    return res.status(200).json({message:'user updated successfully'});
    }
    catch(err){
        logger.error("Internal Server Error")
        return res.json(err)
    }
});
  
// delete a user
  const deleteuser = asyncHandler(async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            logger.error('user not found')
            res.status(404).send({message:"user not found"})
            return 
        }
        // if (contact.user_id.toString() !== req.user.id) {
        //   res.status(403);
        //   throw new Error("User don't have permission to update other user contacts");
        // }
        await UserModel.deleteOne({ _id: req.params.id });
        logger.info('User Deleted successfully')
        return res.status(200).json({message:"User Deleted successfully"});
    }
    catch(err){
        logger.error("Internal Server Error")
        return res.json({message:err})
    }
  });

module.exports = { registerUser, loginUser, currentUser,getallusers,updateuser,getuser,deleteuser};