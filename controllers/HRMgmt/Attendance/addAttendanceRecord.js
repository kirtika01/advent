const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');
const Counter = require('../../../models/Counter');

exports.addAttendanceRecord = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error(`Employee :: ${req.body.employeeId} is not in the records`)
        }

        let att = new Attendance(req.body);

        let counter = await Counter.findOneAndUpdate({ identifierName: "Attendance" }, { $inc: { count: 1 } },
            { upsert: true, new: true });

        att.attendanceId = `ATTNDCE-${counter.count}`
        att.startDate = new Date();
        att.officeName = req.body.officeName
        att.employeeId = employee.employeeId
        att.employeeName = employee.employeeFullName
        att.lineManagerId=employee.lineManagerId
        att.lineManagerName=employee.lineManagerName
        att.officeCode=req.body.officeCode
        att.officeName=req.body.officeName
    
        let doc = await att.save();

        if (doc) {

            return res.status(200).json({
                status: true,
                message: `Attendance successfully initiated`,
                attendance: doc
            })

        } else {

            throw new Error(`Unable to add Attendance record`)

        }

    } catch (err) {

        await Counter.findOneAndUpdate({ identifierName: "Attendance" },
            { $inc: { count: -1 } }, { upsert: true, returnNewDocument: true });

        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}