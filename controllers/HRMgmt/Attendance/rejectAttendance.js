const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.rejectAttendance = async (req, res) => {
    try {

        let attendance = await Attendance.findOne({ attendanceId: req.body.attendanceId,employeeId: req.body.employeeId });
        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!attendance) {
            throw new Error(`Attendance with attendanceId - ${req.body.attendanceId} for employee ${req.body.employeeId} not found`)
        }

        attendance.rejectionReason = req.body.rejectionReason
        attendance.attendanceStatus = "WFH Rejected"
        employee.wfhBalance = employee.wfhBalance + attendance.totalHours


        let doc =await attendance.save()
        let saveEmployee = await employee.save()

        if(!doc || !saveEmployee){
            throw new Error("Unable to reject WFH attendance")
        }
        return res.status(200).json({
            status:true,
            message:"WFH attendance rejected",
            employeeId:saveEmployee.employeeId,
            wfhBalance:saveEmployee.wfhBalance,
            attendance:doc,
            
        })
    }
    catch (err){
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}