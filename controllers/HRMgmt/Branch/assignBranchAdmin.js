const Branch= require("../../../models/HRMgmt/Branch");
const Employee= require("../../../models/HRMgmt/Employee")

exports.assignBranchAdmin = async (req, res) => {

    try{

        const branch=await Branch.findOne({branchCode:req.body.branchCode})

        const employee=await Employee.findOne({employeeId:req.body.employeeId})

        if(!employee){
            throw new Error ("Employee Not Found - " + req.body.employeeId)
        }



        if(!branch){
            throw new Error ("Unable to find Brach for Branch Code  ::" + req.body.branchCode)
        }

        branch.branchAdminEmpId=employee.employeeId,
        branch.branchAdmin=employee

        let doc= await branch.save()

        if(doc){

            return res.status(200).json({
                status:true,
                message : 'Branch Admin Assigned Successfully',
                branch:branch
            })
        }
        
        else{
            throw new Error ("Branch Admin Assigned Successfully")

        }



        
    }
    
    catch(err){

        console.log(err)
        res.status(500).json({
            status:false,
            message:err.toString()
        })

    }
}