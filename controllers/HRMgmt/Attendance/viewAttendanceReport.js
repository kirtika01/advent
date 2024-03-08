const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');
const Counter = require('../../../models/Counter');

exports.viewAttendanceReport = async (req, res) => {

    try {
        
        let day;
        let start;
        let end;
        let attendanceList;
        let report = [];

        if (req.query.type === 'Week') {
            end = new Date();
            end.setHours(23, 59, 59, 999);

            day = new Date().getDay();

            let totalDays = day + 7;

            start = new Date();
            start.setDate(new Date().getDate() - totalDays);
            start.setHours(0, 0, 0, 0);

            //console.log(start)
            //console.log(end)
            //   console.log(report)

        } else if (req.query.type === 'CurrentMonth') {
            end = new Date();
            //end.setHours(23, 59, 59, 999);

            day = new Date();

            let m = new Date(day.getFullYear(), day.getMonth(), 1).toString()
            console.log(m)
            start = new Date(day.getFullYear(), day.getMonth(), 1);
            // start.setHours(0, 0, 0, 0);

        } else if (req.query.type === 'Month') {

            day = new Date()
            start = new Date(day.getFullYear(), req.query.month - 1, 1);
            end = new Date(day.getFullYear(), req.query.month, 0);

        }

        //console.log(start)
        //console.log(end)

        /////////// Attendnace Query ///////////////
        attendanceList = await Attendance.find({
            employeeId: req.query.employeeId, attendanceStatus: 'Approved',
            startTime: {
                $gte: start, $lte: end
            }
        })


        //console.log(attendanceList)
        let fieldWork = 0;
        let wfh = 0;
        let office = 0;

        attendanceList.forEach((a) => {
            if (a.attendanceType === 'FieldWork') {
                fieldWork++;
            } else if (a.attendanceType === 'InOffice') {
                office++;
            } else {
                wfh++;
            }

            report.push({
                date: new Date(a.startTime).toDateString(),
                inOffice: office,
                fieldWork: fieldWork,
                wfh: wfh,
                total: fieldWork + wfh + office
            })

        })

        //console.log(report)

        if (report.length === 0) {

            let monthName = new Date(start).toLocaleString('default', { month: 'long' })
            return res.status(200).json({
                status: false,
                message: `No Attendance found for the month of ${monthName}`
            })

        } else {

            return res.status(200).json({
                status: false,
                attendanceList: report
            })

        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}