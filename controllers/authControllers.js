const User = require('../models/User')
const jwt = require('jsonwebtoken')



const handelErrors = (err) =>{
    console.log(err.message , err.code)

    let errors = {email:' ' , password:''}
     
    //email login error 
    if(err.message === 'incorrect email'){
        errors.email = 'this email dosnt exists, please try with a valid email '
    }

    //password login error 
    if(err.message === 'incorrect password'){
        errors.password = 'this password is incorrect '
    }

    if(err.code === 11000){
        errors.email  = 'this email is already exist'
        return errors;
        }

    if(err.message.includes('user validation failed')){
       Object.values(err.errors).forEach(({properties}) => {
           errors[properties.path]= properties.message;
       });
    }

    return errors
}

const maxAge = 30*24*60*60;
const createToken = (id) => {
    jwt.sign({id}, 'Moaths Secret' , {
        expiresIn : maxAge 
    })
} 

module.exports.signup_get = (req , res ) => {
    res.render('signup')
}

module.exports.login_get = (req , res ) => {
    res.render('login')
}

module.exports.signup_post = async(req , res ) => {
    const{email,password} = req.body ;
    try {
      const user = await User.create({email , password});
      const Token = createToken(user._id)
      res.cookie('jwt',Token,{maxAge: maxAge*1000 , httpOnly: true })
      res.status(201).json({user : user._id})
    } catch (error) {
      const errors= handelErrors(error)
        res.status(400).json({errors})
    }
}

module.exports.login_post = async(req , res ) => {
    const{email,password} = req.body;

    //User.login({email , password})
    try {
        const user = await User.login(email , password )
        const Token = createToken(user._id)
      res.cookie('jwt',Token,{maxAge: maxAge*1000 , httpOnly: true })
        res.status(200).json({user : user._id})
    } catch (error) {
        const errors = handelErrors(error);
        res.status(400).json({errors})
    }
   
}

module.exports.logout_get = (req ,res) =>{
    res.cookie('jwt' , '' , {maxAge:1});
    res.redirect('/')
}