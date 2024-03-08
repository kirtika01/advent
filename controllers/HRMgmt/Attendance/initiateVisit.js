const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');
const Counter = require('../../../models/Counter');
const moment = require('moment-timezone');

exports.initiateVisit= async (req, res) => {

    try{
        var employee= await Employee.findOne({employeeId:req.body.employeeId})
        if(!employee){
            return res.status(200).json({
                status: false,
                message: `Employee :: ${req.body.employeeId} is not in the records`
            })
        }
        else{
            let att = new Attendance(req.body);

            let counter = await Counter.findOneAndUpdate({ identifierName: "Attendance" }, { $inc: { count: 1 } },{ upsert: true, new: true });
            att.attendanceId = `ATTNDCE-${counter.count}`
            att.startTime = new Date();
            att.attendanceType= "Visit";
            att.visitType = req.body.visitType;
            att.visitName=req.body.visitName;
            att.description=req.body.description;
            att.visitLocation=req.body.visitLocation;
            att.employeeId=employee.employeeId;
            att.employeeName=employee.employeeFullName;
            att.lineManagerId=employee.lineManagerId;
            att.lineManagerName=employee.lineManagerName;


            let doc = await att.save();

            if(doc){
                return res.status(200).json({
                    status: true,
                    message: `Visit Attendance successfully initiated`,
                    attendance: doc
                })
    
            } else {
    
                throw new Error(`Unable to add Visit Attendance record`)
    
            }

            
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