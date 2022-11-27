const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type : String ,
         required : [true , 'please enter your email'] , 
         unique : true , 
         lowercase : true ,
         validate : [isEmail , 'please enter a valid email']
    } , 
    password : {
        type : String ,
        required : true ,
        minLength : [6, 'minimum length of the password is 6 '] 
    }
})


//fire a function after the doc is saved
// userSchema.post('save' , function(doc , next){
//     console.log('the user saved as' , doc)
//     next()
// })

//fire a finction before the doc saved
userSchema.pre('save' , async function(next){
    const salt =  await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt)
    next()
})


//static method to login 
userSchema.statics.login = async function(email , password){
   const user = await this.findOne({email});
   if(user){
    const auth = await bcrypt.compare(password , user.password )
    if(auth){
        return user;
    }
        throw Error('incorrect password ')
   } 
    throw Error('incorrect email')
}

const User = new mongoose.model('user' , userSchema)

module.exports = User ;