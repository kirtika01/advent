const mongoose = require('mongoose')
const Schema = mongoose.Schema

const departmentSchema = new Schema({


    departmentId: {
        type: String
    },//DEPT-Counter

    departmentCode: {
        type: String
    },//SchoolCode-DEPT-Short 4 Char Code

    departmentName: {
        type: String,
        required: true
    },

    departmentShortDesc: {
        type: String,
    },

    departmentDesc: {
        type: String,
    },

    departmentType: {
        type: String,
    }, // Law, Engineering, Management, Medical, Arts, Science, Commerce, Architecture, Design, Pharmacy, Nursing, Agriculture, Education, Hotel Management, Mass Communication, Fashion Design, Computer Application, Vocational, Others

    

}, {
    timestamps: true

})


const Department = mongoose.model('Department', departmentSchema)
module.exports = Department