const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const countrySchema = new Schema({

    countryCode: {
        type: String
    },//3-4 digit code in Caps
    countryName: {
        type: String
    },

    countryCurrency:String,
    callingCode:String,
    countryTimeZone:String,
    countryHeadQuarter:{
        fullAddress:String,
        pinCode:String,
        city:String,
        state:String,
        landmark:String,
        country:String
    },

    countryHead:{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    countryHeadName:String,
    
    branches:[{
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        branchCode:String
    }],
    finTeam:{
        type: Schema.Types.ObjectId,
        ref: 'FinTeam'
    }



}, {
    timestamps: true
}
)

module.exports = mongoose.model('Country', countrySchema)