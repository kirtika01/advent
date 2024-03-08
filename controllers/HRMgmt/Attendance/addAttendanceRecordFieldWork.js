const Attendance = require('../../../models/HRMgmt/Attendance');
const Counter = require('../../../models/Counter');
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require('moment-timezone');

exports.addAttendanceRecordFieldWork = async (req, res) => {

    try {

        let attendance = new Attendance(req.body);

        let counter = await Counter.findOneAndUpdate({ identifierName: "Attendance" }, { $inc: { count: 1 } },
            { upsert: true, new: true });

        attendance.attendanceId = `ATTNDCE-${counter.count}`;

        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            return res.status(200).json({
                status: false,
                message: `Employe :: ${req.body.employeeId} does not exist.`
            })
        }
        attendance.employeeId = employee.employeeId;
        attendance.employeeName = employee.employeeFullName
        attendance.lineManagerName = employee.lineManagerName;
        attendance.lineManagerId = employee.lineManagerId;
        attendance.attendanceStatus="Visit Applied";
         
        //let totalHours = Math.abs(new Date(attendance.startTime).getHours() - new Date(req.body.endTime).getHours());
        let diffTime = Math.abs(new Date(attendance.startTime) - new Date(attendance.endTime));
        let totalHours = Math.round(((diffTime/(1000*60))/60)*10)/10
        attendance.totalHours = totalHours;

        const initiationDate = moment.tz(new Date(), "Asia/Kolkata");
        attendance.initiationDate=initiationDate


        let doc = await attendance.save();

        if (doc) {
            return res.status(200).json({
                status: true,
                message: `Attendance successfully initiated`,
                attendance: attendance
            })
        } else {
            throw new Error(`Unable to add the attendance for - ${attendance.attendanceId}.`)
        }

    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}