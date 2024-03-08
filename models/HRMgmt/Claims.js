const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const claimsSchema = new Schema({


    claimId: {
        type: String
    },
    claimStatus: {
        type: String
    },
    /*status 

    
    LineManagerApproval
    AutoApproved/ApprovedLineManager/RejectedLineManager
    FinanceApproved/FinanceRejected
    ClaimSettled*/

    appliedDate: {
        type: Date,
        default: moment.tz(new Date(), "Asia/Kolkata")
    },

   
   
    expenseDate:{
        type:Date
        
    },


    claimType: {
        type: String
    },//Travel, Food, Fuel, OfficeItems, Services, Other

    claimDescription: {
        type: String
    },

    claimAmount: {
        type: Number
    },

    raisedBy: {
        type: String
    },
    raisedByFullName: {
        type: String
    },
    raisedByEmpId: {
        type: String
    },

    isAutoApprovedLineMgr: {
        type: Boolean,
        default: false
    },

    lineMgrApprovalDate: {
        type: Date
    },

    lineMgr: {
        type: String
    },
    lineMgrFullName: {
        type: String
    },
    lineMgrEmpId: {
        type: String
    },

    isApprovedLineMgr: {
        type: Boolean,
        default: false
    },

    lineMgrApprovalComments: {
        type: String
    },//use for both Approve and Reject Scenario


    financeApprover: {
        type: String
    },
    financeApproverFullName: {
        type: String
    },
    financeApproverEmpId: {
        type: String
    },

    isApprovedFinance: {
        type: Boolean,
        default: false
    },


    financeApprovalComments: {
        type: String,
        default: "N/A"
    },//use for both Approve and Reject Scenario

    financeApprovalDate: {
        type: Date
    },

    paymentVoucherId: {
        type: String
    },
    financePaymentDate: {
        type: Date
    },
    financePaymentMode: {
        type: String,
        default: "N/A"
    },
    paymentDone: {
        type: Boolean,
        default: false
    },

    supportingDocument: [
        {
            docType: String,  //eg. pdf, jpg, etc
            docLink: String, //AWS S3 Link
            docName:String, //Description added by user
            uploadDate:Date
        }
    ],



}, {
    timestamps: true
})

const Claims = mongoose.model('Claims', claimsSchema)
module.exports = Claims