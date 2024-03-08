const Lead = require("../../../models/LeadMgmt/Lead");
const Employee = require("../../../models/HRMgmt/Employee");

exports.getLeadByCounsellor = async (req, res) => {
    try{
        const employee = await Employee.findOne({ employeeId: req.params.employeeId })

        if(!employee){
            throw new Error("Employee not found")
        }

        const leads = await Lead.find({ counsellorAssigned: employee })

        if(leads.length == 0){
            throw new Error("No leads Assigned to this Counsellor")
        }

        return res.status(200).json({
            status: true,
            message: "List of leads assigned to this Counsellor",
            No_Of_Leads: leads.length,
            leads: leads
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