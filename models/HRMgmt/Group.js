const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const groupSchema = new Schema({

    groupId: {
        type: String
    },//GRP-counter

    groupName: {
        type: String
    },

    groupScope: {
        type: String
    },//Team, Cluster, Branch, Country, Global??

    groupRole: {
        type: String
    },//Councullor, Manager Sales, Branch Manager, etc

    groupTeamId:{
        type:String
    },
    groupClusterId:{
        type:String
    },
    groupBranchId:{
        type:String
    },
    groupCountryId:{
        type:String
    },

    groupAclId: {
        type: String
    },

    groupMembers:[{
        employeeId:String
    }]


}, {
    timestamps: true
}
)

module.exports = mongoose.model('Group', groupSchema)