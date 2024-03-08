const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.inOfficeReport = async (req, res) => {
    try {

        let employees = await Employee.find({ isActive: true });

        let emp = [];
        await employees.reduce(async (promise, employee) => {

            await promise;

            let obj = {};
            obj.employeeId = employee.employeeId;
            obj.status = 'Not In Office';
            // obj.employeeFullName = employee.employeeFullName;

            // if(obj.employeePhoto){
            //     obj.employeePhoto = employee.employeePhoto;
            // }

            emp.push(obj);

        }, Promise.resolve())



        let attendanceList = await Attendance.find({
            attendanceType: 'InOffice',
            createdAt: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lte: new Date().setHours(23, 59, 59, 999)
            }
        })

        console.log(emp.length , attendanceList.length)

        await attendanceList.reduce(async (promise, attendance) => {
            await promise;

            emp = emp.map(employee => {
                if (employee.employeeId === attendance.employeeId) {

                    if (attendance.attendanceType === 'Leave') {
                        employee.status = 'On Leave';
                    }

                    if (attendance.startTime && attendance.endTime) {
                        employee.status = 'Left Office';
                        employee.inTime = attendance.startTime;
                        employee.outTime = attendance.endTime;
                    }

                    if (attendance.startTime && !attendance.endTime) {
                        employee.status = 'In Office';
                        employee.inTime = attendance.startTime;
                    }

                    if (!attendance.startTime && !attendance.endTime) {
                        employee.status = 'Not In Office';
                    }

                }

                return employee;

            });



        }, Promise.resolve())

        return res.status(200).json({
            success: true,
            data: emp
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.toString()
        });
    }
}