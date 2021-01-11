const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName:String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    token: String,
    salt: String,
    phone: String,
    role:String,
    company:String,
    numberFollower:Number,
    favoriteGame:String,
    urlSocialNetwork:String,
    bio:String,
    campaign_id:[{ type: mongoose.Schema.Types.ObjectId, ref: 'campaigns'}]
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel