const Lead =require("../../../models/Lead");
const Counter= require("../../../models/Counter");
const axios = require('axios');
let path = require("path");
const fs = require("fs");

const handlebars = require('handlebars');


exports.createNewLeadWebFormTemp =async(req,res) =>{
    try{

        const lead =req.body;

        let counter = await Counter.findOneAndUpdate({ identifierName: "Lead" }, { $inc: { count: 1 } }, { upsert: true, new: true })
            const LeadId = "LD-" + counter.count;

            const newlead = new Lead(lead);

            newlead.leadId =LeadId;
            newlead.leadSource = "Website";
            newlead.campaignId="CMPGN-2324-W-001"
            newlead.leadStatus = "New Lead";

            let doc = await newlead.save();

            if (!doc) {
                let counter = await Counter.findOneAndUpdate({ identifierName: "Lead" }, { $inc: { count: -1 } }, { upsert: true, new: true })
                throw new Error(
                    "Unable to Create New Lead"
                )
            }
            else {

                const filePath = path.join(__dirname, '../../../emailTemplates/acknowledgement/leadAcknowledgement.html');
                const source = fs.readFileSync(filePath, 'utf-8').toString();
                const template = handlebars.compile(source);
                const replacements = {
                    leadName: newlead.leadFirstName,
                };
                const htmlToSend = template(replacements);

                // send acknowledgement email
                url = process.env.URL + '/api/v1/utils/sendEmail'
                let subject = `Thank you for contacting us from Advent`;

                
                //console.log(html)
                console.log(lead.leadEmail)
                let mailSent = await axios.post(url, {
                    to: lead.leadEmail,  // Change to email address that you want to receive messages on
                    subject: subject,
                    html: htmlToSend
                })

                if(mailSent.status== 200){
                    console.log("Mail Sent")
                }
                else{
                    console.log("Mail Not Sent")
                }

                

                return res.status(200).json({
                    status: true,
                    message: "New Lead Successfully Created",
                    Lead: doc
                })
            }
                


    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }
}