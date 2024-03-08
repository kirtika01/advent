const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.getListOfActiveWFH = async (req, res) => {

    try {
        let employee = await Employee.findOne({ employeeId: req.params.employeeId });

        if (!employee) {
            throw new Error(`Employee with employeeId - ${req.params.employeeId} not found`)
        }

        let activeAttendanceList = await Attendance.aggregate([
            {
                $match: {
                    attendanceStatus: { $in: ['WFH Applied', 'WFH Accepted', 'WFH Initated'] },
                    employeeId: req.params.employeeId
                }
            },
        ]);

        if(activeAttendanceList.length > 0){
            return res.status(200).json({
                status:true,
                count:activeAttendanceList.length,
                message:"List of active attendance",
                employeeId:req.params.employeeId,
                wfhBalance:employee.wfhBalance,
                noOfAttendance:activeAttendanceList.length,
                activeAttendanceList:activeAttendanceList
            })
        }
        throw new Error(`No active attendance found for employee with employeeId - ${req.params.employeeId}`)
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}