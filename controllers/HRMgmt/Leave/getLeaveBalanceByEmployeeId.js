const Employee = require('../../../models/HRMgmt/Employee');
const LeavePlan = require('../../../models/HRMgmt/LeavePlan');

exports.getLeaveBalanceByEmployeeId = async (req, res) => {

    try {
        let employee = await Employee.findOne({ employeeId: req.params.employeeId });

        if (!employee) {
            throw new Error(`Employee :: ${req.params.employeeId} does not exist.`)
        }

        let leavePlan = await LeavePlan.findOne({ leavePlanId: employee.leavePlanId });

        if (!leavePlan) {
            throw new Error(`Employee :: ${req.params.employeeId} does not have a Leave Plan.`)
        }

        return res.status(200).json({
            status : true,
            leavePlanId : employee.leavePlanId,
            lineManagerName : employee.lineManagerName,
            leaveBalance : employee.leaveBalance,
            leavePlan : leavePlan
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}