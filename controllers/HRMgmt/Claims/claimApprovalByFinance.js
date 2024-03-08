const Claim = require('../../../models/HRMgmt/Claims');
const Employee = require('../../../models/HRMgmt/Employee');
const firebaseAdmin = require("firebase-admin");
const moment = require('moment-timezone');


exports.claimApprovalByFinance = async (req, res) => {
    try {

        let claim = await Claim.findOne({ claimId: req.body.claimId });

        if (!claim) {
            return res.status(200).json({
                status: false,
                message: 'Claim Not Found.'
            })
        } else {

            claim.isApprovedFinance = req.body.isApproved;
            claim.financeApprovalComments = req.body.financeApprovalComments;
            claim.financeApprover = req.body.financeApprover;
            claim.financeApproverFullName = req.body.financeApproverFullName;
            claim.financeApprovalDate = moment.tz(new Date(), "Asia/Kolkata");
            claim.financeApproverEmpId = req.body.financeApproverEmpId;
            
            claim.claimStatus = req.body.isApproved ? 'FinanceApproved' : 'FinanceRejected';
            
            let body;
            let title;

            if (req.body.isApproved) {
                title = `${claim.claimId} Approved By Finance`;
                body = 'Acceptance Notification'
            } else {
                title = `${claim.claimId} Rejected By Finance`;
                body = 'Rejection Notification'
            }

            let employee = await Employee.findOne({ employeeId: claim.raisedByEmpId });
            if (!employee) {
                return res.status(400).json({
                    status: false,
                    message: `Employee ${req.body.financeApproverEmpId} Not Found.`
                })

            }

            let doc = await claim.save();

            if (doc) {

                await sendFCMNotification(employee,claim)

                return res.status(200).json({
                    status: true,
                    message: `Claim successfully ${req.body.isApproved ? 'Approved' : 'Rejected'} by Finance Manager`,
                    claim: claim
                })


            } else {
                throw new Error(`Unable to update Claim :: ${req.body.claimId}`)

            }

        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }

}


const sendFCMNotification=async(employee,claim)=>{
   
   
    let messagingPayload

    if (claim.isApprovedFinance === true ) {

        messagingPayload = {
            notification: {
                title : `${claim.claimId} Approved By Finance. `,
                body : `Claim ${claim.claimId} is approved by Finance Approver : ${claim.financeApproverFullName} and would be settled soon`,
                imageUrl: 'https://westroad-prd.s3.us-east-2.amazonaws.com/FCMTemplates/claim_auto_approve.png'
            },
            
        };
                
                
    } else {

        messagingPayload = {
            notification: {
                title : `${claim.claimId} Rejected By Finance. `,
                body : `Claim ${claim.claimId} is rejected by Finance.Rejected by : ${claim.financeApproverFullName}. Reason : ${claim.financeApprovalComments}`,
                imageUrl: 'https://westroad-prd.s3.us-east-2.amazonaws.com/FCMTemplates/claim_auto_approve.png'
            },
            
        };
        
        
    }

    

    

    firebaseAdmin.messaging().sendToDevice(employee.deviceToken,messagingPayload)
    .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log(error)
        throw new Error('Error sending message:', error);
    })

    

}