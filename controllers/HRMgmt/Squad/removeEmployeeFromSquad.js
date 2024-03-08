const Squad = require('../../../models/HRMgmt/Squad');
const Employee = require('../../../models/HRMgmt/Employee');

exports.removeEmployeeFromSquad = async (req, res) => {
    try{
        let squad = await Squad.findOne({squadCode: req.body.squadCode});
        let employee = await Employee.findOne({employeeId: req.body.employeeId});

        if(!squad){
            throw new Error (`No Squad Found for squadCode-- ${req.body.squadCode}`)
        }
        if(!employee){
            throw new Error (`No Employee Found for employeeId-- ${req.body.employeeId}`)
        }

        let updateemployee = await Employee.findOneAndUpdate({employeeId:req.body.employeeId},
            {$pull:{squads:{squadCode:req.body.squadCode}}},{new:true});

        if(updateemployee){

            let members = await Employee.find({squads:{$elemMatch:{squadCode:req.body.squadCode}}});

            let updateSquad = await Squad.findOneAndUpdate({squadCode:req.body.squadCode},{$set:{memberCount:members.length}},{new:true});

            if(!updateSquad)throw new Error("Unable to update Squad memberCount")

            return res.status(200).json({
                status: true,
                message: "Employee Removed from Squad Successfully",
                squadCode:req.body.squadCode,
                employeeId:req.body.employeeId,
                employee:updateemployee
            })
        }
        else{
            throw new Error("Unable to remove Employee from Squad")
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            message:err.toString()
        })
    }
}