const mongoose = require('mongoose')
const userScheme = new mongoose.Schema({
    email : {
        type : String,
        require : true, 
        unique : true
    },
    password : {
        type : String ,
        require : true
    }
})

module.exports = mongoose.model('User' , userScheme);