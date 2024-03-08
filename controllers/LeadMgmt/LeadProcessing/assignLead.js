const Employee = require('../../../models/HRMgmt/Employee');
const Lead = require('../../../models/LeadMgmt/Lead');


exports.assignLead = async (req, res) => {
    try{
        //console.log(req.body)
        const lead = await Lead.findOne({leadId: req.body.leadId})
        const employee = await Employee.findOne({employeeId: req.body.employeeId})
        const assigneeEmployee = await Employee.findOne({employeeId: req.body.assigneeEmployeeId})

        if(!lead){
            throw new Error(`No Lead found for Lead ID :: ${req.body.leadId}`)
        }
        if(!employee){
            throw new Error(`No Employee found for Employee ID :: ${req.body.employeeId}`)
        }
        if(!assigneeEmployee){
            throw new Error(`No Employee found for Employee ID :: ${req.body.assigneeEmployeeId}`)
        }
        let assignee ={
            employeeFullName: assigneeEmployee.employeeFullName,
            employeeId: assigneeEmployee.employeeId
        }
        

        lead.counsellorAssigned =employee
        lead.assignedType = 'Supervisor'
        lead.leadStatus='Counsellor Assigned'
        lead.counsellorAssignedBy.employeeFullName=assigneeEmployee.employeeFullName
        lead.counsellorAssignedBy.employeeId=assigneeEmployee.employeeId
        
        lead.counsellorAssignedDate =new Date(),
        lead.nextTelecallingDate = new Date().setDate(new Date().getDate()+1)
        
        const result = await lead.save()

        if(result){
            return res.status(200).json({
                status: true,
                message: 'Lead successfully Assigned',
                leadId: lead.leadId,
                employeeId: employee.employeeId,
                Lead: lead,
                Counsellor: employee
            })
        }
        else{
            throw new Error(`Unable to assign the lead for - ${lead.leadId}.`)
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