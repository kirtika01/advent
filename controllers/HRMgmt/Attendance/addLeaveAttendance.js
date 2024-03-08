const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');
const Counter = require('../../../models/Counter');
const moment = require('moment');

exports.addLeaveAttendance = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            return res.status(404).json({
                status: false,
                message: `Employee - ${req.body.employeeId} is not in the records`
            })
        }

        let att = new Attendance();

        let counter = await Counter.findOneAndUpdate({ identifierName: "Attendance" }, { $inc: { count: 1 } },
            { upsert: true, new: true });

        att.attendanceId = `ATTNDCE-${counter.count}`

        let startDate = req.body.startDate;

        let year = new Date(startDate).getFullYear()
        let month = new Date(startDate).getMonth() + 1;

        if (month < 10) {
            month = `0${month}`
        }
        let date = new Date(startDate).getDate();
        if (date < 10) {
            date = `0${date}`
        }

        let startTime;
        let endTime;

        if (req.body.leaveHalf) {
            startTime = req.body.leaveHalf === 'First' ? `${year}-${month}-${date}T11:00:00` : `${year}-${month}-${date}T15:00:00`
            endTime = req.body.leaveHalf === 'First' ? `${year}-${month}-${date}T15:30:00` : `${year}-${month}-${date}T19:30:00`
        }
        else {
            startTime = `${year}-${month}-${date}T11:00:00`;
            endTime = `${year}-${month}-${date}T19:30:00`;
        }

        console.log(startTime, endTime)

        // moment.tz(date, Aisa Kolkata)
        att.startTime =  moment.tz(new Date(startTime), 'Asia/Kolkata');
        att.endTime =  moment.tz(new Date(endTime), 'Asia/Kolkata');
        att.totalHours = req.body.leaveHalf ? 4.5 : 8.5;
        att.attendanceType = 'Leave';
        att.attendanceStatus = 'Approved';
        att.initiationDate = new Date();
        att.approvalDate = new Date();

        att.employeeId = req.body.employeeId;
        att.employeeName = req.body.employeeName;
        att.lineManangerId = req.body.lineManangerId;
        att.lineManagerName = req.body.lineManagerName;

        let doc = await att.save();

        if (doc) {

            return res.status(200).json({
                status: true,
                attendance: doc
            })

        } else {

            throw new Error(`Unable to add Attendance record`)

        }

    } catch (err) {

        await Counter.findOneAndUpdate({ identifierName: "Attendance" },
            { $inc: { count: -1 } }, { upsert: true, returnNewDocument: true });

        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}