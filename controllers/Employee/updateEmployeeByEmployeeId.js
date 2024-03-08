const Employee= require("../../models/Employee");

exports.updateEmployeeByEmployeeId = async(req,res) =>{
    try{
        const employee = await Employee.findOne({employeeId:req.body.employeeId})

        if(employee){

            const updateemployee=await Employee.findOneAndUpdate({employeeId:req.body.employeeId},req.body,{new:true})
            if(updateemployee){
                return res.status(200).json({
                    status:true,
                    message: "Employee successfully updated"
                })
            }else{
                return res.status(200).json({
                    status:false,
                    message: "Unable to update Employee"
                })
            }
        }
        else{
            return res.status(200).json({
                status:false,
                message: "Employee does not exists"
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