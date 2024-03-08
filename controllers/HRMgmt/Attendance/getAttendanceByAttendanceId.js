const Attendance = require("../../../models/HRMgmt/Attendance")

exports.getAttendanceByAttendanceId = async (req, res) => {

    try {

        let id = req.params.attendanceId;

        let doc = await Attendance.findOne({ attendanceId: id });

        if (doc) {
            return res.status(200).json({
                status: true,
                attendance: doc
            })
        } else {
            throw new Error ('Attendance - ' + id + ' not found')
        }



    }

    catch (err) {
        console.log(err)
        

        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}
