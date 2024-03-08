const Employee = require('../../../models/HRMgmt/Employee');

exports.updateSalaryAccount = async(req,res) =>{

    try{

        const employee= await Employee.findOne({employeeId:req.body.employeeId})

        console.log(req.body)
        console.log(employee)
        if(!employee){
           
            throw new Error("Employee not Found")
        }

        employee.salaryAccount= req.body.salaryAccount

        let updatedEmployee = await employee.save();

        if (updatedEmployee) {
            return res.status(200).json({
                status: true,
                message: "Salary Account Updated Successfully",
                salaryAccount: employee.salaryAccount
            })
        }

        else{
            throw new Error("Error in updating Salary Account")
        
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