const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const squadSchema = new Schema({

    squadCode: {
        type: String
    },//4-6 Chars

    squadName: {
        type: String
    },

    squadLogo: {
        type: String
    },

    squadMission: {
        type: String
    },

    squadGeo: {
        type: String
    },

    squadType: {
        type: String
    },//Student Support, Process

    
    
    branchCode:String,

    isRelatedSquadAssigned:{
        type:Boolean,
		default:false
    },

    relatedSquad: {
        type: Schema.Types.ObjectId,
        ref: 'Squad'
    },

    memberCount:{
        default:0,
        type:Number
    },

    

    /*squadMembers:[{
        type:Schema.Types.ObjectId,
        ref:'Employee',
        position:String//Counsellor 1,Counsellor 2,Counsellor 3,Counsellor 4,Counsellor 5,SupportExecutive 1,SupportExecutive 2,Marketing,Student Squad Leader
        //ProcessExecutive1,ProcessExecutive2,ProcessExecutive3,ProcessExecutive4,ProcessExecutive5,ProcessSupportExecutive1 ,ProcessSupportExecutive2,Marketing, Process Squad Leader
    }],//redundant
    

    marketingEmpId: {
        type: String,
        default:"NA"
    },
    marketingFullName: {
        type: String,
        default: "Not Assigned",
       
    },
    marketingLineManagerName:{
        type: String,
        default:"NA"
        
    },
   


    counsellor1EmpId: {
        type: String,
        default:"NA"
    },
    counsellor1FullName: {
        type: String,
        default: "Not Assigned"
    },
    counsellor1LineManagerName:{
        type: String,
        default:"NA"
        
    },
   

    counsellor2EmpId: {
        type: String,
        default:"NA"
    },
    counsellor2FullName: {
        type: String,
        default: "Not Assigned"
    },
    counsellor2LineManagerName:{
        type: String,
        default:"NA"
        
    },
    


    counsellor3EmpId: {
        type: String,
        default:"NA"
    },
    counsellor3FullName: {
        type: String,
        default: "Not Assigned"
    },
    counsellor3LineManagerName:{
        type: String,
        default:"NA"
        
    },
    


    counsellor4EmpId: {
        type: String,
        default:"NA"
    },
    counsellor4FullName: {
        type: String,
        default: "Not Assigned"
    },
    counsellor4LineManagerName:{
        type: String,
        default:"NA"
        
    },
    


    counsellor5EmpId: {
        type: String,
        default:"NA"
    },
    counsellor5FullName: {
        type: String,
        default: "Not Assigned"
    },
    counsellor5LineManagerName:{
        type: String,
        default:"NA"
        
    },
    

    supportExec1EmpId: {
        type: String,
        default:"NA"
    },
    supportExec1Allocation: {
        type: Number,
        default: 0
    }, //0,0.33,0.5,0,66,0.75,1
    supportExec1FullName: {
        type: String,
        default: "Not Assigned"
    },
    supportExec1LineManagerName:{
        type: String,
        default:"NA"
        
    },
    


    supportExec2EmpId: {
        type: String,
        default:"NA"
    },
    supportExec2Allocation: {
        type: Number,
        default: 0
    }, //0,0.33,0.5,0,66,0.75,1
    supportExec2FullName: {
        type: String,
        default: "Not Assigned"
    },
    supportExec2LineManagerName:{
        type: String,
        default:"NA"
    },
   


    squadLeaderEmpId: {
        type: String,
        default: "NA"
    },
    squadLeaderFullName: {
        type: String,
        default: "Not Assigned"
    },
    squadLeaderLineManagerName:{
        type: String,
        default:"NA"
    },*/
    
    







    


}, {
    timestamps: true
}
)

module.exports = mongoose.model('Squad', squadSchema)