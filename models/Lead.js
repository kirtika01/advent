const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leadSchema = new Schema({

    leadId: {
        type: String,
        required: true,
        unique: true
    },
    leadStatus:{
        type:String,
        default:"NewLead"
    },
    /*
    NewLead, LeadAssigned, Telecalling, MeetingScheduled,OnboardingInProgress, LeadOnboarded
    LeadCancelled LeadReOpened
    */


    leadFirstName:{
        type: String

    },

    leadLastName:{
        type: String

    },

    leadAddress: [{
        fullAddress: String,
        city: String,
        pinCode: Number,
        state: String

    }],

    leadPhoneNo:{
        type: Number
    },
    leadEmail:{
        type:String
    },
    leadDescription:{
        type: String
    },

    //lead assigned by
    assignedBy:{
        type: String
    },

    assignedByFullName:{
        type:String
    },

    //lead assigned to 
    assigneeUserName: {
        type: String,
        default:"UnAssigned"
    },
    assigneeUserFullName: {
        type: String,
        default:"UnAssigned"
    },

    schoolRecommendationArray:[{

        schoolId:String,
        schoolName:String,
        city:String,
        country:String,
        intake:String,
        logo:String,
        thumbNail:String,
        recommendationDate:Date
        
    }],

    comments: [{
        comment: String,
        commentedBy: String,
        commentType: String,
        commentTime: {
            type: Date,
            default: Date.now
        }
    }],


}, {
    timestamps: true
})



const Lead = mongoose.model('Lead', leadSchema)
module.exports = Lead