const Attendance = require('../../../models/HRMgmt/Attendance');

exports.getListOfAttendanceRecord = async (req, res) => {
    try {

        let query = {};

        if (req.query.employeeId) {
            query['employeeId'] = req.query.employeeId;
        }

        if (req.query.attendanceType) {
            query['attendanceType'] = req.query.attendanceType
        }

        if (req.query.attendanceStatus) {
            query['attendanceStatus'] = req.query.attendanceStatus

        }
        if(req.query.lineManagerId){
            query['lineManagerId'] = req.query.lineManagerId;
        }

        let list;

        if (Object.keys(query).length > 0) {

            list = await Attendance.find(query);
        } else {
            list = await Attendance.find()
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                listOfAttendance: list,
                no : list.length
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Attendance record found',
               
            })
        }

    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}