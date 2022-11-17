const mongoose = require('mongoose')
const { boolean } = require('webidl-conversions')

const schema = new mongoose.Schema({
  loginToken: {
    type: String,
    required: false,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3,
    max: 20
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 1000
  },
  date: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3
  }
})

module.exports = mongoose.model('pokeusers', schema) //pokeUser is the name of the collection in the db





