const mongoose = require('mongoose')
const Schema = mongoose.Schema

const councillingSlotsSchema = new Schema({

    slotId:String, // SLOT-COunter

    slotDate:Date, // Date of the slot
    slotDay:String, // Day of the slot Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    slotStartTime:String, // Start Time of the slot
    slotEndTime:String, // End Time of the slot
    slotDuration:Number, // Duration of the slot

    slotStatus:String, // Available, Booked, Assigned, Completed, Cancelled, Expired    

    branchCode:String, // Branch Code
    branchName:String, // Branch Name
    slotCreatedBy:String, // EmployeeID
    slotCreatedByFullName:String, // Employee Full Name

    slotBookingType: String, // In Office, Online, Telephonic
    slotBookedFor: String, // Lead, Student
    slotBookedId: String, // LeadID, StudentID
    slotBookerFullName: String, // Lead Full Name, Student Full Name
    slotBookerType:String,//Employee, Lead, Student
    slotBookedOn:Date, // Date of the slot booking
    slotBookedFrom:String, // Website Lead, Mobile App, Student Dashboard, Employee App

    slotAssignedTo:String, // EmployeeID
    slotAssignedToFullName:String, // Employee Full Name
    slotAgenda:String, // Agenda of the slot
    slotMeetingLink:String, // Meeting Link

    slotCompletedOn:Date, // Date of the slot completion
    slotCompletedBy:String,// EmployeeID
    slotCompletedByFullname:String,// Employee Full Name

    slotCancelledOn:Date, // Date of the slot cancellation
    slotCancelledBy:String, // EmployeeID
    slotCancelledByFullName:String, // Employee Full Name
    slotCancellationReason:String, // Reason for cancellation


    isExpired:{
        type:Boolean,
        default:false
    },
    


}, {
    timestamps: true
})



const CouncillingSlots = mongoose.model('CouncillingSlots', councillingSlotsSchema)
module.exports = CouncillingSlots