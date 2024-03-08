const Attendance = require('../../../models/HRMgmt/Attendance');
var nodemailer = require('nodemailer');
const Employee = require('../../../models/HRMgmt/Employee');
const axios = require('axios');

exports.updateAttendanceRecord = async (req, res) => {

    try {

        let attendance = await Attendance.findOne({ attendanceId: req.body.attendanceId });

        if (!attendance) {
            throw new Message(`${req.body.attendanceId} is not in the records.`)
        }

        attendance.endTime = req.body.endTime;
        attendance.attendanceStatus = "Approved";

        //let totalHours = Math.abs(new Date(attendance.startTime).getHours() - new Date(req.body.endTime).getHours());
        let date = `${new Date(attendance.startTime).getDate()}-${new Date(attendance.startTime).toLocaleString('default', { month: 'short' })}-${new Date(attendance.startTime).getFullYear()}`
        let diffTime = Math.abs(new Date(attendance.startTime) - new Date(attendance.endTime));
        let totalHours = Math.round(((diffTime / (1000 * 60)) / 60) * 10) / 10

        let desc = `${totalHours} hours auto approved for ${date}`;
        attendance.totalHours = totalHours
        attendance.description = desc;

        let doc = await attendance.save();

        let employee = await Employee.findOne({ employeeId: attendance.employeeId });
        let manager = await Employee.findOne({ employeeId: employee.lineManagerId });

        let startTimeHours;
        let h = new Date(attendance.startTime).getHours()
        let m = new Date(attendance.startTime).getMinutes()
        startTimeHours = `${h}:${m}`

        let endTimeHours;
        h = new Date(attendance.endTime).getHours()
        m = new Date(attendance.endTime).getMinutes()
        endTimeHours = `${h}:${m}`
        //console.log(startTimeHours, endTimeHours)

        if (doc) {

            var subject = `Attendance Swipe - ${employee.employeeFirstName} ${employee.employeeLastName} - ${date}`
            var content = `${employee.employeeFirstName} ${employee.employeeLastName}, \n \n ${desc}.`

            let url = process.env.URL + '/api/v1/utils/sendEmail'

            let mailSent = await axios.post(url, {
                to: employee.officialEmail,   // Change to email address that you want to receive messages on
                cc: manager.officialEmail,
                subject: subject,
                text: content
            })

            if (mailSent.status === 200) {

                res.status(200).json({
                    status: true,
                    message: `Attendance of ${req.body.attendanceId} successfully updated for ${date}`,
                    date : date,
                    startTime : startTimeHours,
                    endTime : endTimeHours,
                    totalHours: totalHours,

                })

            } else {
                throw new Error('errorrr')
            }

        } else {
            throw new Error('Unable to Swipe Out. Connect your Line Manager')
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}
