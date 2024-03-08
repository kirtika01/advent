const Employee = require("../../../models/HRMgmt/Employee");

exports.assignRoleToEmployee = async (req, res) => {
    try {

        const employee = await Employee.findOne({ employeeId: req.body.employeeId })
        if (employee) {

            if (employee.isActive === true) {

                employee.employeeRole = req.body.employeeRole;

                let doc = await employee.save();

                if (doc) {
                    return res.status(200).json({
                        status : true,
                        employee : doc
                    })
                } else {
                    throw new Error(`Unable to update employee Role.`)
                }

            } else {
              return  res.status(200).json({
                    status: false,
                    message: 'Employee is not active'
                })
            }
        }
        else {
            throw new Error(`Employee ~ ${req.body.employeeId} Not Found.`)
        }




    }

    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}