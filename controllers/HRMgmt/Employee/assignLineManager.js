const Employee= require("../../../models/HRMgmt/Employee");

exports.assignLineManager= async (req,res)=>{
    try{

        const checkEmployee = await Employee.findOne({ employeeId: req.body.employeeId })
        if(!checkEmployee){
            return res.status(200).json({
                status:false,
                message: "No Employee found for Employee ID-"+req.body.employeeId
            })
        }

        const checkLineManager = await Employee.findOne({ employeeId: req.body.lineManagerId })
        
        if(!checkLineManager){
            return res.status(200).json({
                status:false,
                message: "No Line Manager found for Employee ID-"+req.body.lineManagerId
            })
        }
        

        if(checkLineManager.isActive===true){
            checkEmployee.lineManagerId=checkLineManager.employeeId,
            checkEmployee.lineManagerName=checkLineManager.employeeFullName
           

            let employee = await checkEmployee.save();
            if(employee){
                return res.status(200).json({
                    status:true,
                    message: "Line Manager Assigned Successfully",
                    Employee: employee
                })
            }

        }
        else{
            throw new Error ("Line Manager not Active")
        }
            

    }

    catch(err){
        return res.status(500).json({
            status:false,
            error: err.toString()
        })
    }
}