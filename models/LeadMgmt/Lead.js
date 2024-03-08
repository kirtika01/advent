const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leadSchema = new Schema({

    leadId: {
        type: String,
        required: true,
        unique: true
    },

    creationDate: {
        type: Date,
        default: new Date()
    },

    leadStatus: {
        type: String,
        default: "NewLead"
    },
    /*
    New Lead/Lead ReOpened,Counsellor Assigned,Calling In Progress,Counselling In Progress, Student Onboarded,Lead Cancelled 
    
    */

    closureState: {
        type: String,
        default: null
    },

    queueName: {
        type: String,
        default: "NotAssigned"
    },

    leadPriority: {
        type: String,
        default: "Normal"
    },//Normal, High, Urgent

    leadFirstName: {
        type: String

    },

    leadMiddleName: {
        type: String

    },

    leadLastName: {
        type: String

    },

    leadAddress: {
        fullAddress: String,
        city: String,
        pinCode: Number,
        state: String
    },

    leadPhoneNo: {
        type: Number
    },
    leadEmail: {
        type: String
    },
    leadSource:{
        type:String
    },

    campaignId:{
        type:String
    },
    
    
    leadDescription:{
        type: String
    },
    purpose:{
        type: String
    },
    trainingOn:{
        type: String
    },
    preferredCountry1:{
        type: String
    },

    preferredCountry2:{
        type: String
    },

    course:{
        type: String
    },
    

    
    
    // counsellor

    counsellorAssigned:{
        type:Schema.Types.ObjectId,
        ref:'Employee'
    },

    assignedType:String, // Pulled, Supervisor
    
    counsellorAssignedBy: {
        employeeFullName:String,
        employeeId:String
    },
    
    counsellorAssignedDate: {
        type: Date,
    },

    nextTelecallingDate: {
        type: Date,
        default:null
    },
    
    lastTelecallingDate: {
        type: Date,
        default:null
    },
    totalTelecallingCount: {
        type: Number,
        default: 0
    },

    
    sseAssigned:{
        type:Schema.Types.ObjectId,
        ref:'Employee',
        default:null
    },//Student support Executive

    studentSupportSquad:{
        type:Schema.Types.ObjectId,
        ref:'Squad',
        default:null
    },// Same as Counsellor



    processExecutiveAssigned:{
        type:Schema.Types.ObjectId,
        ref:'Employee',
        default:null
    },//Process Executive

    processSupportSquad:{
        type:Schema.Types.ObjectId,
        ref:'Squad',
        default:null
    },// Same as Process Executive




    initialMeetingScheduled:{
        type: Boolean,
        default: false
    },
    initialMeetingDate: {
        type: Date,
    },

    councellingInProgress:{
        type: Boolean,
        default: false
    },
    councellingStartDate: {
        type: Date,
    },

    convertLeadToOnboarded:{
        type: Boolean,
        default: false
    },
    onboardingDate: {
        type: Date,
    },

    studentUserName: {
        type: String
    },

    
    isReopened: {
        type: Boolean,
        default: false
    },
    reOpenedDate: {
        type: Date,
    },
    

    schoolRecommendation: [
        {
            school: {},
            course: {},
            addedDate: Date,
            tag: {
                type: String,
                default: "NotAdded"
            }
        }

    ],

    comments: [{
        comment: String,
        commentedBy: String,//Add User Full Name Here
        commentType: String,// Counsellor ,Lead, Auto,Self,Team Lead
        commentTime: {
            type: Date
        }
    }],


}, {
    timestamps: true
})



const Lead = mongoose.model('Lead', leadSchema)
module.exports = Lead