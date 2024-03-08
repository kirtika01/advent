const Branch= require("../../../models/HRMgmt/Branch");
const Employee= require("../../../models/HRMgmt/Employee")

exports.assignBaseBranchToEmployee= async (req, res) => {

    try{

        let branch=await Branch.findOne({branchCode:req.body.branchCode})
        let employee=await Employee.findOne({employeeId:req.body.employeeId})

        if(!employee){
            throw new Error ("Employee Not Found - " + req.body.employeeId)
        }
        if(!branch){
            throw new Error ("Unable to find Brach for Branch Code  ::" + req.body.branchCode)
        }

        employee.baseBranchCode=branch.branchCode
        employee.baseBranchName=branch.branchName
        employee.baseBranchState=branch.branchAddress.state

        let doc = await employee.save()

        if(!doc){
            throw new Error ("Unable to save add Base Branch to Employee")
        }
        return res.status(200).json({
            status: true,
            message: "Base Branch Added to Employee Successfully",
            employee: doc
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            status:false,
            message:err.toString()
        })

    }
}
