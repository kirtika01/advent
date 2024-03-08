const mongoose = require('mongoose')
const Schema = mongoose.Schema

const faceSchema = new mongoose.Schema({
    label: {
      type: String,
      
    },
    descriptions: {
      type: Array,
    },
    employeeId: {
        type: String,
    },
    userName: {
        type: String,
    }
  });
  
  module.exports = mongoose.model("Face", faceSchema);
