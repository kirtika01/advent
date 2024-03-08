const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.findScanInAttendance = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.params.employeeId });

        if (!employee) {
            throw new Error('Employee not found');
        }

        let attendance = await Attendance.findOne({
            attendanceType: "InOffice",
            attendanceStatus: "Initiated",
            employeeId: req.params.employeeId,
            $and: [
                {
                    createdAt: { $gte: new Date(moment.tz(new Date().setHours(0, 0, 0, 0),"Asia/Kolkata")) }
                },
                {
                    createdAt: { $lte: new Date(moment.tz(new Date().setHours(23, 59, 59, 999),"Asia/Kolkata")) }
                }
            ]
        });

        console.log(moment.tz(new Date().setHours(0, 0, 0, 0),"Asia/Kolkata"))
        if (attendance) {
            return res.status(200).json({
                status: true,
                scanDone: true,
                attendance: attendance
            })
        }else{
            return res.status(200).json({
                status: true,
                scanDone: false
            })
        }

    } catch (err) {

        console.log(err);
        return res.status(500).json({
            status: false,
            error: err.toString()
        })

    }
}