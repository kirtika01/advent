const Employee = require("../../../models/HRMgmt/Employee");

exports.assignHRManager = async (req, res) => {
    try {

        const checkEmployee = await Employee.findOne({ employeeId: req.body.employeeId })

        if (!checkEmployee) {
            throw new Error(`Employee not found with employeeId - ${req.body.employeeId}`)
        }

        const checkhrManagerId = await Employee.findOne({ employeeId: req.body.hrManagerId })

        if (!checkhrManagerId) {
            throw new Error(`HR Manager not found with employeeId - ${req.body.hrManagerId}`)
        }


        if (checkhrManagerId.isActive != true) {
            throw new Error("HR Manager not Active")
        }

        checkEmployee.hrManagerId = checkhrManagerId.employeeId,
        checkEmployee.hrManagerName = checkhrManagerId.employeeFullName


        let employee = await checkEmployee.save();

        if (employee) {
            return res.status(200).json({
                status: true,
                message: "HR Manager Assigned Successfully",
                Employee: employee
            })
        }

        throw new Error("Cannot assign HR Manager")
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}