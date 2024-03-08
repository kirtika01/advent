const SalaryStructure = require('../../../models/HRMgmt/SalaryStructure')
const Employee = require('../../../models/HRMgmt/Employee')

exports.checkCTCAvailabity = async (req, res, next) => {

    try{

        let employeeCheck = await Employee.findOne({employeeId:req.query.employeeId})

        if(!employeeCheck){
            throw new Error(`Employee with employeeId - ${req.query.employeeId} Not Found`)
        }
        let ctcCheck = await SalaryStructure.findOne({employeeId:req.query.employeeId, finYear:req.query.finYear})

        if(ctcCheck){
            return res.status(200).json({
                status:true,
                message:"Salary Structure already exist for "+req.query.employeeId+" for the financial year "+req.query.finYear
            })
        }

        else{
            return res.status(200).json({
                status:false,
                message:"Ok. No Salary Structure found for "+req.query.employeeId+" for the financial year "+req.query.finYear
            })
        }

    }catch(err){
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    }

}

