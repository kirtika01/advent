const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');
const Counter = require('../../../models/Counter');
const moment = require('moment-timezone');

exports.completeVisit= async (req, res) => {

    try{

        let employee= await Employee.findOne({employeeId:req.body.employeeId})
        if(!employee){
            return res.status(200).json({
                status: false,
                message: `Employee :: ${req.body.employeeId} is not in the records`
            })
        }

        let attendance = await Attendance.findOne({ attendanceType:"Visit", attendanceId:req.body.attendanceId,attendanceStatus:"Initiated" })

        

        if(!attendance){
            return res.status(200).json({
                status: false,
                message: `Attendance :: ${req.body.attendanceId} is not in the records`
            })
        }

        attendance.endTime=new Date();
        //let totalHours = Math.abs(new Date(attendance.startTime).getHours() - new Date(req.body.endTime).getHours());
        let date = `${new Date(attendance.startTime).getDate()}-${new Date(attendance.startTime).toLocaleString('default', { month: 'short' })}-${new Date(attendance.startTime).getFullYear()}`
        let diffTime = Math.abs(new Date(attendance.startTime) - new Date(attendance.endTime));
        let totalHours = Math.round(((diffTime / (1000 * 60)) / 60) * 10) / 10

        let commuteHours = parseInt(req.body.commuteHours)
        totalHours=totalHours+commuteHours
        attendance.totalHours = totalHours
        attendance.commuteHours=commuteHours

        attendance.isVisitCompleted=true

        let doc = await attendance.save();

        if(doc){
            return res.status(200).json({
                status: true,
                message: `Visit Attendance successfully captured`,
                attendance: doc
            })
    
        }
        else{
            throw new Error(`Unable to complete Visit Attendance`)
        }




    }
    catch(err){

        console.log(err)
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    }
    
}