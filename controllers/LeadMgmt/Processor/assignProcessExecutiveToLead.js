const Lead = require("../../../models/LeadMgmt/Lead");
const Employee = require("../../../models/HRMgmt/Employee");
const Squad = require("../../../models/HRMgmt/Squad");


exports.assignProcessExecutiveToLead = async (req, res) => {
    try{
        const lead = await Lead.findOne({ leadId: req.body.leadId })
        const processExecutive = await Employee.findOne({ employeeId: req.body.processExecutiveId })

        if(!lead){
            throw new Error("Lead not found")
        }
        if(!processExecutive){
            throw new Error("Process Executive not found")
        }

        const processExecutiveSqaud = await Squad.findOne({ squadCode: processExecutive.squadCode })

        if(!processExecutiveSqaud){
            throw new Error("Process Executive Squad not found")
        }

        lead.processExecutiveAssigned = processExecutive
        lead.processSupportSquad = processExecutiveSqaud

        let doc = await lead.save()

        if(!doc){
            throw new Error("Error in assigning Process Executive to Lead")
        }
        return res.status(200).json({
            status: true,
            message: "Process Executive assigned to Lead successfully",
            lead: doc
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}