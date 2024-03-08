const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LeavePlanSchema = new Schema({

        leavePlanId:{
            type: String
        },//LPLAN-Counter.

        isActive:{
            type: Boolean,
            default: false
        },//Active or Inactive

        leavePlanName:{
            type: String
        },//Unique Check

        description:{
            type: String
        },

        

        isFlexiPlan:{
            type: Boolean,
            default: false   
        },//can employee take flexible days weekly off
        flexiOff:{
            type: Number
        },//No of Flexi Off per week

        fixedOffCount:{
            type: Number
        },//No of Fixed Off per week

        fixedOffDays:[{ 
            dayName: String,
            day:Number
        }],//Fixed Off Days
        
        //Leave Credits
        leaveCredits: [{
            leaveCode: String,
            leaveType: String,
            balance: Number,
            maxLimit: Number,
            isCarryForward: Boolean,
            isSpecialLeave: Boolean,
            frequency: String,//Monthly,Quarterly,Yearly,One Time
            isMedicalLeave: Boolean,
            comments: String
        }]

        


        

    },{
        timestamps: true
    }
)

const LeavePlan = mongoose.model('LeavePlan', LeavePlanSchema)
module.exports = LeavePlan