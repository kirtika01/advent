const axios= require("axios");
const Lead = require("../../../models/Lead");
const fbaseAdmin = require("firebase-admin");
const moment = require("moment-timezone");

exports.closeTeleCallFollowUp = async (req, res) => {
    try{


        const { 
            leadId,
            comment,
            commentedBy,
            commentedByRole

        } = req.body;

        const lead = await Lead.findOne({ leadId:leadId })

        if (!lead) {
            return res.status(200).json({
                status: false,
                message: "No Lead found for Lead ID :: " + req.body.leadId
            })
        }

        lead.nextTelecallingDate=null,
        lead.lastTelecallingDate=moment.tz(new Date(), "Asia/Kolkata")
        lead.totalTelecallingCount=lead.totalTelecallingCount+1

        let doc = await lead.save();

        if (!doc) {

            throw new Error(
                "Unable to Close Telecaller Followup"
            )
        }

        else {

            let url = process.env.URL + '/api/v1/lead/leadProcessing/addCommentToLead';
            axios.post(url,{
                "leadId":leadId,
                "comment":{
                    comment: "Follow Up is closed at-" + moment.tz(new Date(), "Asia/Kolkata").format("DD-MM-YYYY") + " by " + commentedBy,
                    commentedBy: commentedBy,
                    commentType: "System"
                }
            },{
                headers: {
                    'Authorization': `${req.headers.authorization}`,
                    'Platform':`${req.headers.platform}`
                }

            })

            //create Notification
            //Send FCM Notification to Telecaller

            return res.status(200).json({
                status: true,
                message: "Followup Closed for Lead : "+leadId,
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