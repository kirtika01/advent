const Employee = require("../../../models/HRMgmt/Employee")

exports.getLeaveBalanceList = async (req, res, next) => {
    try {

        const employees = await Employee.find({ isActive: true })

        if (employees.length === 0) {
            return res.status(200).json({
                status: false,
                message: `No Active employees found!`

            })
        }

        let data = [];

        employees.forEach((employee) => {
            data.push({
                userName: employee.userName,
                employeeFullName: employee.employeeFullName,
                leavePlanId: employee.leavePlanId,
                leavePlanName: employee.leavePlanName,
                leaveBalance: employee.leaveBalance,
            })
        })

        return res.status(200).json({
            status: true,
            leaveBalanceList : data
        })
       

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}

