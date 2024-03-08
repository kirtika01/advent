const mongoose = require('mongoose')
const Schema = mongoose.Schema

const otpSchema = new Schema({

	sessionId:String,
	leadPhoneNo:String,
	employeeId:String,
	studentId:String,

	otpType:String, //Student, Employee, Lead
	otp: {
		type: Number
	},
	validTill:Date,
	isExpired:{
		type:Boolean,
		default:false
	}
}, {
    timestamps: true
})



const OTP = mongoose.model('OTP', otpSchema)
module.exports = OTP
