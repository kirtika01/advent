const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.getLastScan = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.params.employeeId });

        if (!employee) {
            throw new Error('Employee not found');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(today)

        let attendance = await Attendance.findOne({
            attendanceType: "InOffice",
            attendanceStatus: { $in: ["Approved", "Initiated"] },
            employeeId: req.params.employeeId,
            createdAt: { $gte:today } 
        }).sort({ createdAt: -1 }).limit(1);

        if(!attendance){
            throw new Error(`No attendance found for employee with employeeId - ${req.params.employeeId}`)
        }
        return res.status(200).json({
            message:"Last attendance scan",
            employeeId:req.params.employeeId,
            attendance: attendance
        })
        

    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}