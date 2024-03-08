const Lead =require("../../../../models/LeadMgmt/Lead");
const Counter= require("../../../../models/Counter");

const addCommentToLead = require('../../Util/addCommentToLead')
const axios = require('axios');

//const emailBody = require('../../../emailTemplates/acknowledgement/acknowledgement')


exports.captureLeadWebsite =async(req,res) =>{

    try{
        console.log("captureLeadWebsite")

        const lead =req.body;
        const oldlead=await Lead.findOne({leadPhoneNo:req.body.leadPhoneNo});

        let counter = await Counter.findOneAndUpdate({ identifierName: "Lead" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        
        lead.leadId = "LEAD-" + counter.count;

        const newLead = new Lead(lead);

        
        
        console.log(oldlead)
        
        if(oldlead){


            if(oldlead.leadStatus === "New Lead"||oldlead.leadStatus==="Calling In Progress"||oldlead.leadStatus==="Counsellor Assigned"){

                oldlead.leadPriority= "High"
                await oldlead.save()
                return res.status(200).json({
                    status: true,
                    leadInProgress:true,
                    message: "we have already received your application and we would connect with you soon",
                    lead: oldlead
                })
            }

            await newLead.save()
        


            let campaignId = newLead.campaignId?newLead.campaignId:"NA"
            
            let returnStatus = addCommentToLead.addCommentToLead(newLead.leadId,`Lead re-opened,Source : ${newLead.leadSource} ${newLead.leadSubSource} Campaign : ${campaignId}.Old Lead ID: ${oldlead.leadId}`,`System`,`NA`,`Auto`)
            
            if(returnStatus===false){
                throw new Error('Error in adding comment to lead')
            }

            newLead.isReopened = true
            newLead.oldLeadId = oldlead.leadId
            newLead.leadPriority= "High"
        }
        else{

            let campaignId = newLead.campaignId?newLead.campaignId:"NA"
            let returnStatus = addCommentToLead.addCommentToLead(newLead.leadId,`Lead created, Source : ${newLead.leadSource} ${newLead.leadSubSource} Campaign : ${campaignId}`,`System`,`NA`,`Auto`)
            
            if(returnStatus===false){
                throw new Error('Error in adding comment to lead')
            }

            newLead.leadPriority= "Normal"
        }

        let saveLead = await newLead.save();

        if(!saveLead){
            throw new Error('Error in saving lead')
        }

        return res.status(200).json({
            status: true,
            message: "New Lead Successfully Created",
            lead: saveLead
        })





    }
    catch(err){

        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
            
    }

}