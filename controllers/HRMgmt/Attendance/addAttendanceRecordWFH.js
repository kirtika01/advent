const Attendance = require('../../../models/HRMgmt/Attendance');
const Counter = require('../../../models/Counter');
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require('moment-timezone');

exports.addAttendanceRecordWFH = async (req, res) => {

    try {

        let attendance = new Attendance(req.body);

        let counter = await Counter.findOneAndUpdate({ identifierName: "Attendance" }, { $inc: { count: 1 } },
            { upsert: true, new: true });

        attendance.attendanceId = `ATTNDCE-${counter.count}`;

        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            return res.status(200).json({
                status: false,
                message: `Employee - ${req.body.employeeId} does not exist`
            })
        }

        //let totalTime = Math.abs(new Date(req.body.endTime).getHours() - new Date(req.body.startTime).getHours());
        let diffTime = Math.abs(new Date(attendance.startTime) - new Date(attendance.endTime));
        let totalTime = Math.round(((diffTime/(1000*60))/60)*10)/10
        
        if (totalTime > employee.wfhBalance) {
            return res.status(200).json({
                sttaus: false,
                message: `Not Enough WFH Balance. The current Balance is ${employee.wfhBalance} Hrs. Cannot enter your WFH Attendance.`
            })
        }

        attendance.employeeId = employee.employeeId;
        attendance.employeeName = employee.employeeFullName;
        attendance.lineManagerId = employee.lineManagerId;
        attendance.lineManagerName = employee.lineManagerName;
        attendance.totalHours = totalTime;
        attendance.attendanceStatus = "WFH Applied";
        employee.wfhBalance = employee.wfhBalance - totalTime;

        const initiationDate = moment.tz(new Date(), "Asia/Kolkata");
        attendance.initiationDate=initiationDate

        let doc = await attendance.save();
        let employeeUpdate=await employee.save();

        if (doc) {
            return res.status(200).json({
                status: true,
                message: `Attendance successfully initiated`,
                wfhBalance: employeeUpdate.wfhBalance,
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