const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AttendanceSchema = new Schema({

    attendanceId: {
        type: String
    },//ATTNDCE-<counter>

    startTime: {
        type: Date
    },

    endTime: {
        type: Date
    },

    totalHours:{
        type:Number,
        default:0
    },

    attendanceType: {
        type: String
    }, //WFH,InOffice,Visit,Leave

    attendanceStatus: {
        type: String,
        default: "Initiated"
    },
    //Initiated,Approved, Rejected
    //WFH Applied, WFH Accepted, WFH Initated, WFH Completed, Approved, Rejected
    //Visit Applied, Visit Accepted, Visit Initiated, Visit Completed, Approved, Rejected


    startLat: {
        type: Number
    },
    startLong: {
        type: Number
    },
    endLat:{
        type:Number
    },
    endLong:{
        type:Number
    },

    acceptanceComment: String,
    
    officeName:{
        type:String,
    },

    officeCode:{
        type:String,
    },
    description:String,

    isVisitCompleted:{
        type:Boolean,
        default:false
    },
    visitType:String,
    visitName:String,
    visitLocation:String,//pass lat,long
    commuteHours:{
        type:Number,
        default:0
    },
    
    initiationDate: {
        type: Date
    },

    approvalDate: {
        type: Date
    },

    rejectionReason: String,


    employeeId: String,
    employeeName: String, //employeeFullName

    lineManagerId: String,
    lineManagerName: String,//employeeFullName

    selfRejected: {
        type: Boolean,
        default: false
    },

    approvedBy: String,//Emp ID
    approverName: String,//Emp Name



}, {
    timestamps: true
}
)

module.exports = mongoose.model('Attendance', AttendanceSchema)