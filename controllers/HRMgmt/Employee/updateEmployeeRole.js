const Employee= require("../../../models/HRMgmt/Employee");

exports.updateEmployeeRole = async(req,res) =>{
    try{
        const employee = await Employee.findOne({employeeId:req.body.employeeId})

        if(!employee){
            return res.status(200).json({
                status: false,
                message: "Employee not Found"
            })
        }
        
        employee.employeeRole=req.body.employeeRole;

        let updatedEmployee = await employee.save();
        if(updatedEmployee){
            return res.status(200).json({
                status:true,
                message: "Employee Role Updated Successfully",
                Employee: employee
            })
        }

            
        
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}