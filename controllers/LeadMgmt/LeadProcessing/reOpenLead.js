const Employee = require('../../../models/HRMgmt/Employee');
const Lead = require('../../../models/LeadMgmt/Lead');
const axios = require('axios');

exports.reOpenLead = async (req, res) => {
    try {
        let lead = await Lead.findOne({ leadId: req.body.leadId })

        if (!lead) {
            throw new Error(`No Lead found for Lead ID :: ${req.body.leadId}`)
        }
        if(lead.leadStatus !="Lead Cancelled"){
            throw new Error("Lead is not Cancelled")
        }

        lead.counsellorAssigned = null
        lead.assignedType = null
        lead.counsellorAssignedBy = null
        lead.lastTelecallingDate = null
        lead.totalTelecallingCount = 0
        lead.sseAssigned = null
        lead.initialMeetingScheduled = false
        lead.initialMeetingDate = null
        lead.councellingInProgress = false
        lead.councellingStartDate = null
        lead.counsellorAssignedDate = null
        lead.nextTelecallingDate=null

        lead.isReopened = true
        lead.leadStatus = "Lead ReOpened"

        let doc = await lead.save();

        if (!doc) {
            throw new Error('Unable to reOpen lead')
        }

        if (req.body.isSelfAssigned == true) {

            let employee = await Employee.findOne({ employeeId: req.body.currentEmployeeId })

            if (!employee) {
                throw new Error("Employee Not Found")
            }

            let noofLeadsAssignedToEmployee = await Lead.find({ counsellorAssigned: employee})

            if (noofLeadsAssignedToEmployee.length > 5) {

                return res.status(200).json({
                    status: true,
                    message: "New Lead Successfully ReOpened And Cannot Assign to Employee as he has more than 5 Leads",
                    Lead: doc
                })
            }
            let url = process.env.URL + '/api/v1/leadmgmt/leadProcessing/pullLead'

            let assignedLead = await axios.put(url, {
                leadId: req.body.leadId,
                employeeId: req.body.currentEmployeeId,
                assigneeEmployeeId: req.body.currentEmployeeId,

            })
            //console.log(assignedLead.data.Lead)
            if (assignedLead.status == 200) {
                return res.status(200).json({
                    status: true,
                    message: "New Lead Successfully ReOpened And Assigned to Employee",
                    lead: assignedLead.data.Lead
                })
            }
            return res.status(200).json({
                status: false,
                message: "Lead Successfully ReOpened but not Assigned to Employee - Please Assign Manually",
                lead: doc
            })

        }
        return res.status(200).json({
            status: true,
            message: "Lead Successfully ReOpened",
            lead: doc
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}