const Lead = require("../../../../models/LeadMgmt/Lead");
const Employee = require("../../../../models/HRMgmt/Employee");
const Counter = require("../../../../models/Counter");
const axios = require('axios');

//const emailBody = require('../../../emailTemplates/acknowledgement/acknowledgement')


exports.createNewLeadInBoundCall = async (req, res) => {

    let leadCreateError = false

    try {

        const lead = req.body;

        let counter = await Counter.findOneAndUpdate({ identifierName: "Lead" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        const LeadId = "LD-" + counter.count;

        const newlead = new Lead(lead);

        newlead.leadId = LeadId;
        newlead.leadSource = "Inbound";
        newlead.leadStatus = "New Lead";

      

        let doc = await newlead.save();

        if (!doc) {
            leadCreateError = true
            throw new Error("Unable to Create New Lead")
        }


        if (lead.assignment == "Self") {

            let employee = await Employee.findOne({ employeeId: lead.currentEmployeeId })

            if (!employee) {
                throw new Error("Employee Not Found") 
            }
            
            let noofLeadsAssignedToEmployee = await Lead.find({ counsellorAssigned: employee })

            if (noofLeadsAssignedToEmployee.length > 5) {

                
                return res.status(200).json({
                    status: true,
                    message: "New Lead Successfully Created And Cannot Assign to Employee as he has more than 5 Leads",
                    Lead: doc
                })
            }
            else {
                

                let url = process.env.URL + '/api/v1/leadmgmt/leadProcessing/pullLead'

                let assignedLead = await axios.put(url, {
                    leadId: LeadId,
                    employeeId: lead.currentEmployeeId,
                    assigneeEmployeeId: lead.currentEmployeeId,
                    
                })

                

                if(assignedLead.status == 200){
                    return res.status(200).json({
                        status: true,
                        message: "New Lead Successfully Created And Assigned to Employee",
                        Lead: doc
                    })

                    
                }
                else{
                    return res.status(200).json({
                        status: false,
                        message: "New Lead Successfully Created but not Assigned to Employee - Please Assign Manually",
                        Lead: doc
                    })
                }
            }
        }
        else {


            
            return res.status(200).json({
                status: true,
                message: "New Lead Successfully Created",
                lead: doc
            })
        
        }

    }
    catch (err) {

        if(leadCreateError==true){

            let counter = await Counter.findOneAndUpdate({ identifierName: "Lead" }, { $inc: { count: -1 } }, { upsert: true, new: true })
        
        }
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}

/*
                // send acknowledgement email
                url = process.env.URL + '/api/v1/utils/sendEmail'
                let subject = `Thank you for contacting us from Advent`;

                let html

                
                html = `${emailBody}`;

                console.log(html)
                console.log(lead.leadEmail)
                let mailSent = await axios.post(url, {
                    to: lead.leadEmail,  // Change to email address that you want to receive messages on
                    subject: subject,
                    html: html
                })

                if(mailSent.status== 200){
                    console.log("Mail Sent")
                }
                else{
                    console.log("Mail Not Sent")
                }
                */