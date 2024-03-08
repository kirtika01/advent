const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const finTeamSchema = new Schema({

    finTeamCode: {
        type: String
    },//FIN-Countrycode

	finTeamName: {
		type: String
	},

	countryCode: {
		type: String
	},

    countryName: {
        type: String
    },

    countryCurrency:String,
    
    finTeamAdmin:{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    finTeamAdminName:String,
    
    branches:[{
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        branchCode:String
    }]


}, {
    timestamps: true
}
)

module.exports = mongoose.model('FinTeam', finTeamSchema)