const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.completeWFH  = async (req, res) => {

    try {

        let attendance = await Attendance.findOne({ attendanceId: req.body.attendanceId,employeeId: req.body.employeeId });
        let employee = await Employee.findOne({ employeeId: req.body.employeeId });


        if (!attendance) {
            throw new Error(`Attendance with attendanceId - ${req.body.attendanceId} for employee ${req.body.employeeId} not found`)
        }

        attendance.attendanceStatus = "WFH Completed"
        attendance.endTime = new Date(req.body.endTime)
        attendance.endLat = req.body.endLat
        attendance.endLong = req.body.endLong

        let totalHours=attendance.totalHours

        let timeDifference = attendance.endTime - attendance.startTime;
        let totalTime = timeDifference / (1000 * 60 * 60);

        console.log(totalTime)

        if(totalTime>totalHours){

            difference=totalTime-totalHours

            employee.wfhBalance = employee.wfhBalance - difference

            if(employee.wfhBalance<0){
                employee.wfhBalance=0
            }
        }
        else if(totalTime<totalHours){

            difference=totalHours-totalTime
            employee.wfhBalance = employee.wfhBalance + difference

           
        }

        employee.wfhBalance = Math.floor(employee.wfhBalance)


        attendance.totalHours=totalTime


        let doc =await attendance.save()
        let employees = await employee.save()

        if(!doc || !employees){
            throw new Error("Unable to completed WFH attendance")
        }
        return res.status(200).json({
            status:true,
            message:"WFH attendance completed",
            employeeId:req.body.employeeId,
            wfhBalance:employees.wfhBalance,
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