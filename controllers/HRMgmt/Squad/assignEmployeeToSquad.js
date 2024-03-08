const Squad = require('../../../models/HRMgmt/Squad');
const Employee = require('../../../models/HRMgmt/Employee');

exports.assignEmployeeToSquad = async (req, res) => {
    try{
        let squad = await Squad.findOne({squadCode: req.body.squadCode});
        let employee = await Employee.findOne({employeeId: req.body.employeeId});

        if(!squad){
            throw new Error (`No Squad Found for squadCode-- ${req.body.squadCode}`)
        }
        if(!employee){
            throw new Error (`No Employee Found for employeeId-- ${req.body.employeeId}`)
        }

        // Add code for allocation & ALREADY ASSIGNED

        //define a variable allocationPercentage = 0
        let allocationPercentage =0

        // iterate employee.squads to check if squadCode already exists
        for(let i=0; i<employee.squads.length; i++){
            if(employee.squads[i].squadCode === req.body.squadCode){
                throw new Error("Employee Already Assigned to this Squad. Role :  "+employee.squads[i].squadRole)
            }
            allocationPercentage = allocationPercentage + employee.squads[i].allocation
        }

        //after the iteration futureAllocationPercentage = allocationPercentage + req.body.squad.allocation
        let futureAllocationPercentage = allocationPercentage + req.body.allocation


        //if futureAllocationPercentage > 100, return error message  "Total Allocation Percentage Exceeds 100%. Current Allocation is " + allocationPercentage
        if(futureAllocationPercentage > 100){
            throw new Error("Total Allocation Percentage Exceeds 100%. Current Allocation is " + allocationPercentage)
        }

        
        let squadPush = {
            squadCode: squad.squadCode,
            squadName: squad.squadName,
            squadRole: req.body.squadRole,
            squadLogo: squad.squadLogo,
            allocation: req.body.allocation,
            branch: req.body.branch
        }

        employee.squads.push(squadPush);
        let saveEmployee = await employee.save();
        
        
        if(saveEmployee){

            let members = await Employee.find({squads:{$elemMatch:{squadCode:req.body.squadCode}}});

            let updateSquad = await Squad.findOneAndUpdate({squadCode:req.body.squadCode},{$set:{memberCount:members.length}},{new:true});

            if(!updateSquad)throw new Error("Unable to update Squad memberCount")

            return res.status(200).json({
                status: true,
                message: "Employee Assigned to Squad Successfully",
                squadCode:req.body.squadCode,
                employeeId:req.body.employeeId,
                Employee:saveEmployee,
            })
        }
        else{
            throw new Error("Unable to Assign Employee to Squad")
        }

    }
    catch(err){
        return res.status(500).json({
            status: false,
            message: err.toString()
        })
    }
}