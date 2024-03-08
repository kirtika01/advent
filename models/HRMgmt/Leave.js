const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LeaveSchema = new Schema({

    leaveId: {
        type: String,
        require: true

    },

    employeeId: {
        type: String
    },

    employeeFullName: {
        type: String
    },

    leaveCode: {
        type: String
    },//CL,SL,PL,ML,PL,BL,LWP

    leaveType: {
        type: String 
    },//Casual Leave, Sick Leave, Privilege Leave, Maternity Leave, Paternity Leave, Bereavement Leave, Leave Without Pay

    leaveStartDate: {
        type: Date
    },
    leaveEndDate: {
        type: Date
    },

    noOfDays: {
        type: Number,
        default: 0
    },

    isHalfDay: {
        type: Boolean,
        default: false
    },

    leaveHalf: {
        type: String //First , Second
    },

    leaveReason: {
        type: String
    },

    lineManagerId: {
        type: String
    },
    lineManagerName: {
        type: String
    },

    applicationDate: {
        type: Date,
        default: new Date()
    },

    applicationStatus: {
        type: String, //Applied, Approved, Rejected
        default: "Applied"

    },
    approvalDate: {
        type: Date

    },

    approvalComment:{
        type:String
    },
    rejectionReason: {
        type: String
    },
    isCancelled: {
        type: Boolean,
        default: false
    },

    supportingDocument: {
        type: String
    },//AWS Link
    supportingDocumentComment: {
        type: String
    },



}, {
    timestamps: true
}
)
const Leave = mongoose.model('Leave', LeaveSchema)
module.exports = Leave