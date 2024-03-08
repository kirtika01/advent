const Attendance = require('../../../models/HRMgmt/Attendance');

exports.getListOfActiveVisits = async (req, res) => {
    try {

        let list = await Attendance.aggregate([
            {
                $match: {
                    employeeId: req.params.employeeId,
                    attendanceStatus: {$in: ['Visit Applied','Visit Accepted','Visit Initiated']}
                }
            }
        ])

        if(list.length > 0){
            return res.status(200).json({
                status: true,
                employeeId:req.params.employeeId,
                number: list.length,
                listOfActiveVisit: list  
            })
        }
        throw new Error ('No active visits')

    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}