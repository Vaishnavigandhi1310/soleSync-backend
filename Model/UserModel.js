const mongoose = require('mongoose')
const {createHmac} = require('crypto')
const jwt = require('jsonwebtoken')
const S_Key = "vaish"
const UserSchema = new mongoose.Schema({
email:
{
    type:String,
    required:true
},
password:
{
    type:String,
    required:true
},
name:
{
    type:String,
    required:true
},
otp: {
    type: String,  // Store OTP as a string
    default: null
}}
,{
    timestamps:true
})

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is new/modified

  const salt = "password";
  this.password = createHmac('sha256', salt)
    .update(this.password)
    .digest('hex');
  next();
});


UserSchema.static('matchPassword',async function(email,password)
{
    const users = await this.findOne({email:email})
    if(!users) throw new Error("Users not found")
        const salt = "password";
    const hassPassword = createHmac('sha256',salt)
    .update(password)
    .digest('hex');
    if(users.password !== hassPassword)
        { throw new Error("Wrong Password") 
        }
    const  token = jwt.sign({userid:users._id},S_Key,{expiresIn:'1h'})
    return token;

})

const UserModel  = mongoose.model("user",UserSchema)
module.exports = UserModel