const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
 
    userName:{
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    },



    userFullName:{
        type: String
    },
    

    userFirstName:{
        type: String
    },

    userMiddleName:{
        type: String,
        default: ""
    },
    userLastName:{
        type: String
    },

    
    registeredEmailId:{

       type: String
    },

    registeredPhoneNo:{
        type: String
    },


    userType:{
        type:String //Employee, Vendor, Agent, CollegeContact, Student
    },
    employeeId:{
        type:String,
        default:null
    },
    studentId:{
        type:String,
        default:null
    },
    otp: Number,
    
}, {
    timestamps: true
})



const User = mongoose.model('User', userSchema)
module.exports = User