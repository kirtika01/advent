const Lead =require("../../models/Lead");
const Counter= require("../../models/Counter");
const axios = require('axios');

exports.createNewLeadWebForm =async(req,res) =>{
    try{
        const lead =req.body;

        const oldlead=await Lead.findOne({leadPhoneNo:req.body.leadPhoneNo});

        if(oldlead){
            let body={
                leadId:oldlead.leadId
            }
            let newcomment={}
            if(oldlead.leadStatus === "LeadCancelled"){
                oldlead.leadStatus ="LeadReOpened";
                let doc = await oldlead.save();

                if (!doc) {
                    throw new Error(
                        "Unable to ReOpen Lead"
                    )
                }
                else{
                    newcomment.comment="Your lead is reopened"
                    //Send an email to Lead saying your lead is reopened

                }
            }
            else if(oldlead.leadStatus === "NewLead"){
                newcomment.comment="we have already received your application and we would connect with you soon"
                //send a message and email saying, we have already received your application and we would connect with you soon
            }
            else if(oldlead.leadStatus !== "LeadCancelled"){
                newcomment.comment=`We are working on your application and your application ID is ${oldlead.leadId}. Our Counsellor ${oldlead.CounsellorName} would reach out to you in a day`
                /*send a message and email, We are working on your application 
                and your application ID is <Lead ID>. Our Counsellor <lead.CounsellorName> would reach out to you in a day.*/
            }


            body={...body,comment:newcomment}
            //console.log(body,"body");

            let url = process.env.URL + '/api/v1/lead/addCommentToLead';
    
            let token = req.headers.authorization;
            let updatelead={}

            try {
                let res = await axios.post(url, body,
                    {
                        headers: {
                            'Authorization': `${token}`
                        }
                    })

                if (res.status === 200) {
                    updatelead=res.data.lead
                }
            } catch (err) {
                //console.log(err);
                throw new Error(err,"comment not added ")

            }
            if(updatelead){
                return res.status(200).json({
                    status: true,
                    message: "Comment Added",
                    Lead: updatelead
                })
            }
            else{
                throw new Error(
                    "Unable to Add Comment"
                )
            }
        }
        else{

        let counter = await Counter.findOneAndUpdate({ identifierName: "Lead" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        const LeadId = "LD-" + counter.count;

        const newlead = new Lead(lead);

        newlead.leadId =LeadId;

        let doc = await newlead.save();

        if (!doc) {
            let counter = await Counter.findOneAndUpdate({ identifierName: "Lead" }, { $inc: { count: -1 } }, { upsert: true, new: true })
            throw new Error(
                "Unable to Create New Lead"
            )
        }
        else {
            return res.status(200).json({
                status: true,
                message: "New Lead Successfully Created",
                Lead: doc
            })
        }
    }

    }
    catch (err) {
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }
}