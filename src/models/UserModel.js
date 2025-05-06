const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
   firstname: {
    type: String,
    required: true,
    minlength: 3
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    minlength: 10
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  userInfo: {
    type: String,

  }
}, {timestamps: true})



module.exports = mongoose.model('User',userSchema)