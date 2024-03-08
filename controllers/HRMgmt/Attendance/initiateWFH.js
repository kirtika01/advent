const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.initiateWFH = async (req, res) => {

    try {

        let attendance = await Attendance.findOne({ attendanceId: req.body.attendanceId,employeeId: req.body.employeeId });

        if (!attendance) {
            throw new Error(`Attendance with attendanceId - ${req.body.attendanceId} for employee ${req.body.employeeId} not found`)
        }

        let diffTime = Math.abs(new Date(req.body.startTime) - new Date(attendance.endTime));
        let totalTime = Math.round(((diffTime/(1000*60))/60)*10)/10

        attendance.attendanceStatus = "WFH Initated"
        attendance.startTime = new Date(req.body.startTime)
        attendance.startLat = req.body.startLat
        attendance.startLong = req.body.startLong
        //attendance.totalHours = totalTime
        

        let doc =await attendance.save()

        if(!doc){
            throw new Error("Unable to initiate WFH attendance")
        }
        return res.status(200).json({
            status:true,
            message:"WFH attendance initiated",
            employeeId:req.body.employeeId,
            attendance:doc
        })

    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}