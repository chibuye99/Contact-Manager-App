const asyncHandler = require('express-async-handler');
const user = require('../models/userModel');
const bcrypt = require("brcypt");
const jwt = require('jsonwebtoken');
//Register a user
//@route POST /api/users/register 
//@public access
const registerUser = asyncHandler(async (request,response)=>{
    const [username,email,password] = request.body
    if(!username || !email || !password){
        response.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        response.status(400);
        throw new Error("User already registered");
    }
    const hashedPassword = await bcrypt.hash(password,10)
    console.log("Hashed password",hashedPassword)
    const user = await User.create({
        username,
        email,
        password:hashedPassword
    });
    console.log(`User created ${user}`)
    if(user){
        response.status(201).json({_id:user.id,email:user.email})
    }else{
        response.status(400)
        throw new Error("User data is not valid")
    }
    response.json({message: "Register the user"})
})

//Login user
//@route POST /api/users/loginr 
//@public access
const LoginUser = asyncHandler(async (request,response)=>{
    const {email,password} = request.body
    if(!email || !password){
        response.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare[password,user.password])){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id
            },
        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        response.status(200).json({accessToken});
    }
    else{
        response.status(401);
        throw new Error("password is not valid")
        }
})

//Show current user information
//@route GET /api/users/current 
//@privat access
const GetCurrentUser = asyncHandler(async (request,response)=>{
    response.json(request.user)
})
module.exports = {
    registerUser,
    LoginUser,
    GetCurrentUser
}