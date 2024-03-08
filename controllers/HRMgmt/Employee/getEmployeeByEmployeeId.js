const Employee = require("../../../models/HRMgmt/Employee");

exports.getEmployeeByEmployeeId = async (req, res) => {
    try {
        
        const result = await Employee.findOne({ employeeId: req.params.employeeId })
        if (result) {
            return res.status(200).json({
                status: true,
                employeeId: req.params.employeeId,
                Employee: result
            })
        } else {
            return res.status(200).json({
                status: false,
                message: "No Employee found for Employee ID :: " + req.params.employeeId
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