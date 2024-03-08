const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({

    studentId: {
        type: String,   
    },
    studentPhoneNo: {
        type: String,
    },//Use this field for login
    studentFirstName: {
        type: String,

    },
    studentMiddleName: {
        type: String,
    },
    studentLastName: {
        type: String,
    },


    leadId: {
        type: String,
    },

    studentEmailId: {
        type: String,
    },
    
    studentGender: {
        type: String,
    },
    
    //write a code to add two numbers
    //write a code to add two numbers   
    //write a code to add two numbers

    studentAddress: {
        type: String,
    },
    studentCity: {
        type: String,
    },
    otp: {
        type: String,
        default: null
    }





    



}, {
    timestamps: true

})


const Student = mongoose.model('Student', studentSchema)
module.exports = Student