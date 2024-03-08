const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');
const axios = require('axios');


exports.selfRejectAttendance = async (req, res) => {

    try{

        var token = req.headers.authorization.split(' ')[1]

        const employee=await Employee.findOne({employeeId:req.body.employeeId});

            if(!employee){
                return res.status(404).json({
                    status: false,
                    error: "Employee not found"
                })
            }

            const attendance=await Attendance.findOne({attendanceId:req.body.attendanceId});

            if(!attendance){
                return res.status(404).json({
                    status: false,
                    error: "Attendance not found"
                })
            }

            let url = process.env.URL + '/api/v1/hrmgmt/Attendance/attendanceApproval';
                    
                    let attendanceUpdate = await axios.put(url, {
                        attendanceId: req.body.attendanceId,
                        isApproved: false,
                        rejectionReason:"Self Rejected",
                        selfRejected:true
                        
                    }, 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'platform':'employeeMobile' 

                        }
                    }
                    

                    )
                        
                    if (attendanceUpdate.status!==200) {
                        console.log(attendanceUpdate)
                        throw new Error(`Unable to self reject attendance for ${req.body.attendanceId}`)
                    }

                    return res.status(200).json({
                        status: true,
                        message: "Attendance Self Rejected"
                    })
                

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }

}