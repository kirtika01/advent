const Lead = require("../../../models/LeadMgmt/Lead");
const Employee = require("../../../models/HRMgmt/Employee");


exports.assignSSEToLead = async (req, res) => {
    try {

        const lead = await Lead.findOne({ leadId: req.body.leadId })
        const SSE = await Employee.findOne({ employeeId: req.body.sseId })

        if(!lead){
            throw new Error("Lead not found")
        }

        if(!SSE){
            throw new Error("SSE not found")
        }

        lead.sseAssigned = SSE

        let doc = await lead.save()

        if(!doc){
            throw new Error("Error in assigning SSE to Lead")
        }

        return res.status(200).json({
            status: true,
            message: "SSE assigned to Lead successfully",
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