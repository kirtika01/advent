const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const ACLSchema = new Schema({

    aclId: {
        type: String
    },//ACL-counter

    aclName: {
        type: String
    },

    aclType: {
        type: String
    },//Group, Employee

    groupId:{
        type:String
    },
    employeeId:{
        type:String
    },

    scope:{
        type:String
    },//Own, Team, Cluster, Branch, Country, Global??
    scopeNumber:{
        type:Number
    },//1-6
    teamId:{
        type:String
    },
    clusterId:{
        type:String
    },
    branchId:{
        type:String
    },
    countryId:{
        type:String
    },


    // School Repository

    schoolRepoAccessLevel:{
        type:Number,
        default:1
    },
    



}, {
    timestamps: true
}
)

module.exports = mongoose.model('ACL', ACLSchema)