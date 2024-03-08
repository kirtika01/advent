const axios = require("axios");
const Lead = require("../../../models/Lead");
const Employee = require("../../../models/HRMgmt/Employee");
const fbaseAdmin = require("firebase-admin");
const moment = require("moment-timezone");

exports.assignTelecallerToLead = async (req, res) => {
    try {


        const { 
            leadId, 
            telecallerEmpId ,
            isSelfAssigned,
            commentedBy

        } = req.body;
         

        const lead = await Lead.findOne({ leadId:leadId })

        if (!lead) {
            return res.status(200).json({
                status: false,
                message: "No Lead found for Lead ID :: " + req.body.leadId
            })
        }

        const teleCaller = await Employee.findOne({ employeeId: telecallerEmpId });

        if (!teleCaller) {
            return res.status(200).json({
                status: false,
                message: "teleCaller is not available - " + telecallerEmpId,
            })
        }

        


        lead.telecallerUserName = teleCaller.userName;
        lead.telecallerFirstName = teleCaller.employeeFirstName;
        lead.telecallerMiddleName = teleCaller.employeeMiddleName;
        lead.telecallerLastName = teleCaller.employeeLastName;
        lead.telecallerEmpId = teleCaller.employeeId;
        lead.telecallerAssignedDate = moment.tz(new Date(), "Asia/Kolkata")
        lead.leadStatus = "CallingInProgress";


        // let body;
        // let title;

        // title = `${lead.leadId} Accepted By ${assignedBy}`;
        // body = 'Assigned Notification'


        let doc = await lead.save();

        if (!doc) {

            

            throw new Error(
                "Unable to Assign Telecaller to the Lead"
            )
        }

        else {



            let url = process.env.URL + '/api/v1/Lead/leadProcessing/addCommentToLead';
            axios.post(url,{
                "leadId":leadId,
                "comment":{
                    comment: `Lead assigned to telecaller ${teleCaller.employeeFirstName} ${teleCaller.employeeMiddleName?teleCaller.employeeMiddleName+ " ":``}${teleCaller.employeeLastName}`,
                    commentedBy: commentedBy,
                    commentType: isSelfAssigned?"Self":"Team Lead"
                }
            },{
                headers: {
                    'Authorization': `${req.headers.authorization}`,
                    'platform':`${req.headers.platform}`
                }

            })

            url =process.env.URL + '/api/v1/Lead/telecalling/setNextTelecallingDate';
            axios.post(url,{
                "leadId":leadId,
                "nextTelecallingDate":moment.tz(new Date(), "Asia/Kolkata"),
                "isSelfAssigned":isSelfAssigned,
                "commentedBy":commentedBy
            },{
                headers: {
                    'Authorization': `${req.headers.authorization}`,
                    'platform':`${req.headers.platform}`
                }
            })

            // send notification
        
            let title = "Lead assigned to you for calling."+ doc.leadId
            let body = "Lead assigned to you for calling."+ doc.leadId
                
            
        
            let tokenTemp = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFkbWluIiwiZW1wbG95ZWVJZCI6IkVtcC0zOCIsInBsYXRmb3JtIjoiZW1wbG95ZWVNb2JpbGUiLCJpYXQiOjE2ODY4MDk1NTcsImV4cCI6MTcxNzkxMzU1N30.zYLkhdDIzjH3MsEriAZntvUAqBLfWs8uEKLmrAFARL4"
            url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
            let sendNotify = await axios.post(url, {
                "notificationAudience": "TeamMember",
                "notificationHeadline": title,
                "notificationBody": body,
                "employeeId": teleCaller.employeeId
            }, {
                headers: {
                    'Authorization': `${req.headers.authorization}`,
                    'platform':`${req.headers.platform}`
                }
            })

            if (sendNotify.status!== 200) {

                console.log("Unable to send notification.Contact Admininistrator")


            }


            return res.status(200).json({
                status: true,
                message: "Telecaller Assigned",
                lead: doc
            })
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