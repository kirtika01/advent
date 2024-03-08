const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const branchSchema = new Schema({

    branchCode: {
        type: String
    },//BRNCH-counter

    branchName: {
        type: String
    },

    isActive:{
        type:Boolean,
        default:true
    },

    branchDescription: {
        type: String
    },

    branchAdminEmpId:{
        type: String
    },

   branchAdmin:{
     type:Schema.Types.ObjectId,
     ref:"Employee"
   },

    HRAssociateEmpId:{
        type: String
    },

    HRAssociate:{
        type:Schema.Types.ObjectId,
        ref:"Employee"
    },

    finTeam:{
        type:Schema.Types.ObjectId,
        ref:"FinTeam",
        
        
    },
    finTeamName:String,
    financeAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },


    branchAddress:{
        addLine1:{
            type:String
        },
        addLine2:{
            type:String
        },
        landmark:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        pinCode:{
            type:String
        },
        country:{
            type:String
        }

    },

    countryCode:String

}, {
    timestamps: true
}
)

module.exports = mongoose.model('Branch', branchSchema)