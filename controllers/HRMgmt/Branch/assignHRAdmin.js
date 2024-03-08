const Branch= require("../../../models/HRMgmt/Branch");
const Employee= require("../../../models/HRMgmt/Employee")

exports.assignHRAdmin = async (req, res) => {

    try{

		let hrAdmin = await Employee.findOne({employeeId:req.body.employeeId})

		if(!hrAdmin){
			throw new Error("Unable to find HR Admin")
		}

		let branch = await Branch.findOne({branchCode:req.body.branchCode})

		if(!branch){
			throw new Error("Unable to find Branch")
		}

		branch.hrAdminEmpId = hrAdmin.employeeId
		branch.hrAdmin = hrAdmin

		await branch.save()

		return res.status(200).json({
			status:true,
			message : 'HR Admin Assigned Successfully',
			branch:branch
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