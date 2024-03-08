const axios= require("axios");
const Lead = require("../../../models/Lead");
const fbaseAdmin = require("firebase-admin");
const moment = require("moment-timezone");

exports.setNextTelecallingDate = async (req, res) => {
    try{

        const { 
            leadId, 
            nextTelecallingDate,
            isSelfAssigned,
            commentedBy,
            commentedByRole

        } = req.body;

        let lead = await Lead.findOne({leadId:leadId})

        if(lead){

            lead.nextTelecallingDate= moment.tz(nextTelecallingDate, "Asia/Kolkata");

            let doc = await lead.save();
            if(doc){
                //send FCM Notification to Telecaller
                //create Notification Object for Telecaller

                //Add Comment in Lead
                let url = process.env.URL + '/api/v1/lead/leadProcessing/addCommentToLead';
                axios.post(url,{
                    "leadId":leadId,
                    "comment":{
                        comment: "Next Calling Date set for " + moment.tz(nextTelecallingDate, "Asia/Kolkata").format("DD-MM-YYYY") + " by " + commentedBy,
                        commentedBy: commentedBy,
                        commentType: "System"
                    }
                },{
                    headers: {
                        'Authorization': `${req.headers.authorization}`,
                        'Platform':`${req.headers.platform}`
                    }

                })

                
                return res.status(200).json({
                    status:true,
                    message:"Successfully set Next Follow Up Date for lead ::"+ leadId,
                    lead : doc
                })

            }
        }
        else{
            throw new Error("Unable to find lead for Lead ID :: "+leadId)
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