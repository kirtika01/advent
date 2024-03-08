const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const compOffSchema = new Schema({

    compOffId: String, //CMP-Counter
    compOffStatus: {
        type:String, //Applied/Approved/Rejected
        default:'Applied'
    },
    appliedDate: {
        type: Date,
        default: moment.tz(new Date(), "Asia/Kolkata")
    },
    compOffDate: {
        type: Date
    },
    compOffType: String, //Full Day/Half Day
    compOffDescription: String,

    raisedBy: String, //userName
    raisedByFullName: String,
    raisedByEmpId: String,

    lineManager: String, //userName
    lineManagerEmpId: String,
    lineManagerFullName: String,

    approvalDate: {
        type: Date
    },
    approvalComment: String, //both approved and rejected comments







}, {
    timestamps: true
})

const CompOff = mongoose.model('CompOff', compOffSchema)
module.exports = CompOff