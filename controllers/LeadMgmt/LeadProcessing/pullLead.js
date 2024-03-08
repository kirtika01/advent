const Employee = require('../../../models/HRMgmt/Employee');
const Lead = require('../../../models/LeadMgmt/Lead');

exports.pullLead = async (req, res) => {
    try{
        const lead = await Lead.findOne({leadId: req.body.leadId})
        const employee = await Employee.findOne({employeeId: req.body.employeeId})

        if(!lead){
            throw new Error ("No Lead Found")
        }
        if(!employee){
            throw new Error ("No Employee Found")
        }

        let noofLeadsAssignedToEmployee = await Lead.find({ counsellorAssigned: employee})

        if(noofLeadsAssignedToEmployee.length > 5){
            throw new Error ("Cannot pull lead as employee has more than 5 Leads")
        }

        lead.counsellorAssigned =employee
        lead.assignedType = 'Pulled'
        lead.leadStatus='Counsellor Assigned'
        lead.counsellorAssignedBy.employeeFullName=employee.employeeFullName
        lead.counsellorAssignedBy.employeeId=employee.employeeId


        lead.counsellorAssignedDate =new Date(),
        lead.nextTelecallingDate = new Date().setDate(new Date().getDate()+1)
        const result = await lead.save()

        if(result){
            return res.status(200).json({
                status: true,
                message: 'Lead successfully pulled',
                leadId: lead.leadId,
                employeeId: employee.employeeId,
                Lead: lead,
                Counsellor: employee
            })
        }
        else{
            throw new Error(`Unable to pull the lead for - ${lead.leadId}.`)
        }

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}