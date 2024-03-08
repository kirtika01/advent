const Claim = require('../../../models/HRMgmt/Claims');
const admin = require("firebase-admin");
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require("moment-timezone");
const firebaseAdmin = require("firebase-admin");


exports.claimApprovalByLineManager = async (req, res) => {
    try {

        let claim = await Claim.findOne({ claimId: req.body.claimId });

        if (!claim) {
            return res.status(200).json({
                status: false,
                message: 'Claim Not Found.'
            })
        } else {


            claim.isApprovedLineMgr = req.body.isApproved;
            claim.lineMgrApprovalComments = req.body.lineMgrApprovalComments
            claim.lineMgrApprovalDate = new Date(moment.tz(new Date(), "Asia/Kolkata"));
            
            if (req.body.isApproved === true || req.body.isApproved === "true") {
                claim.claimStatus = "ApprovedLineManager"
            }
            else {
                claim.claimStatus = "RejectedLineManager"
            }


            

            

            let employee = await Employee.findOne({ employeeId: claim.raisedByEmpId });
            if (!employee) {

                throw new Error(`Employee ${req.body.employeeId} Not Found.`)


            }

            let doc = await claim.save();

            if (doc) {

                await sendFCMNotification(employee,claim)

                return res.status(200).json({
                    status: true,
                    message: `Claim successfully ${req.body.isApproved ? 'Approved' : 'Rejected'} by Line Manager`,
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

    if (claim.isApprovedLineMgr === true ) {

        messagingPayload = {
            notification: {
                title : `${claim.claimId} approved By Line Manager`,
                body : `Claim ${claim.claimId} has been approved by  ${claim.lineMgrFullName} and sent to Finance Team for further processing.`,
                imageUrl: 'https://westroad-prd.s3.us-east-2.amazonaws.com/FCMTemplates/claim_auto_approve.png'
            },
            
        };
                
                
    } else {

        messagingPayload = {
            notification: {
                title : `${claim.claimId} Rejected By Line Manager`,
                body : `Claim ${claim.claimId} has been rejected by ${claim.lineMgrFullName}. Reason : ${claim.lineMgrApprovalComments}`,
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