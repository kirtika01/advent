const Attendance = require('../../../models/HRMgmt/Attendance');

exports.listOfAttendanceForApproval = async (req, res) => {
    try {


        let query = {};


        if(req.query.employeeId){
            query['employeeId'] = req.query.employeeId;
        }
        if(req.query.lineManagerId){
            query['lineManagerId'] = req.query.lineManagerId;
        }

        if(req.query.attendanceType==null){

            query['attendanceStatus'] = {$in:["WFH Applied","Visit Applied","WFH Completed","Visit Completed"]}

        }

        if(req.query.attendanceType=="WFH"){
            query['attendanceStatus'] = {$in:["WFH Applied","WFH Completed"]}
        }

        if(req.query.attendanceType=="Visit"){
            query['attendanceStatus'] = {$in:["Visit Applied","Visit Completed"]}
        }

        //query['attendanceStatus'] = "Initiated"

        //query['attendanceType'] = {$in:["WFH","Visit"]}


        let list;

        if (Object.keys(query).length > 0) {

            list = await Attendance.find(query);
        } else {
            list = await Attendance.find()
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                no : list.length,
                listOfAttendance: list
                
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