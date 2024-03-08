const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');

exports.inOfficeReport = async (req, res) => {
    try {

        let employees = await Employee.find({ isActive: true });
        //console.log(employees.length)
        let report = [];

        await employees.reduce(async (promise, employee) => {

            await promise;

            let attendanceList = await Attendance.find({
                employeeId: employee.employeeId,
                startTime: {
                    $gte: new Date().setUTCHours(0, 0, 0, 0),
                    $lte: new Date().setUTCHours(23, 59, 59, 999)
                }
            })


            if (attendanceList.length === 0) {

                let obj = {
                    employeeId: employee?.employeeId,
                    employeeFirstName: employee?.employeeFirstName,
                    employeeMiddleName: employee?.employeeMiddleName,
                    employeeLastName: employee?.employeeLastName,
                    employeePhoto: employee?.employeePhoto,
                    employeeRole: employee?.employeeRole,
                }


                obj.status = 'Status Unknown'
                obj.officeName = 'Not Applicable'

                report.push(obj)

            }



            await attendanceList.reduce(async (promise, attendance) => {

                await promise;

                console.log(attendance.attendanceId)

                let obj = {
                    employeeId: employee?.employeeId,
                    employeeFirstName: employee?.employeeFirstName,
                    employeeMiddleName: employee?.employeeMiddleName,
                    employeeLastName: employee?.employeeLastName,
                    employeePhoto: employee?.employeePhoto,
                    employeeRole: employee?.employeeRole,
                }


                if ((attendance?.attendanceType === "FieldWork" ||
                    attendance?.attendanceType === "WFH" ||
                    attendance?.attendanceType === "Leave") && attendance.attendanceStatus !== "Approved") {

                    console.log('Filtered out')

                }

                else {

                    if (attendance?.attendanceType === "WFH") {
                        obj.status = 'WFH'
                    }

                    else if (attendance?.attendanceType === "FieldWork") {
                        obj.status = 'Field Work'
                    }

                    else if (attendance?.attendanceType === "Leave") {
                        obj.status = "On Leave"
                        obj.leaveType = attendance.leaveType

                        obj.half = attendance.isHalfDay ? 'Half Day Leave' : 'Full Day Leave'
                        obj.leaveHalf = attendance.leaveHalf ? attendance.leaveHalf : 'NA'

                    }

                    obj.officeName = attendance?.officeName
                    obj.startTime = attendance?.startTime

                    if (attendance.endTime) obj.endTime = attendance.endTime
                    else obj.endTime = 'NA'

                    if (!(attendance?.endTime) && attendance?.attendanceType === "InOffice") {
                        obj.status = "In Office"
                    } else if (attendance?.endTime && attendance?.attendanceType === "InOffice") {
                        obj.status = "Left Office"
                    }


                }

                report.push(obj);

            }, Promise.resolve())



        }, Promise.resolve());


        //////////////////////////////////////////////////////

        // let attendanceList = await Attendance.find({
        //     createdAt: {
        //         $gte: new Date().setHours(0, 0, 0, 0),
        //         $lte: new Date().setHours(23, 59, 59, 999)
        //     }
        // })

        // let emp = [];

        // await attendanceList.reduce(async (promise, attendance) => {
        //     await promise;

        //     if ((attendance?.attendanceType === "FieldWork" ||
        //         attendance?.attendanceType === "WFH" ||
        //         attendance?.attendanceType === "Leave") && attendance.attendanceStatus !== "Approved") {

        //         console.log('Filtered out')

        //     } else {


        //         let employee = await Employee.findOne({ employeeId: attendance?.employeeId });
        //         let obj = {
        //             employeeId: employee?.employeeId,
        //             employeeFullName: employee?.employeeFullName,
        //             employeePhoto: employee?.employeePhoto,
        //             employeeRole: employee?.employeeRole,
        //             officeName: attendance?.officeName
        //         }

        //         if (attendance?.attendanceType === "WFH") {
        //             obj.status = 'WFH'
        //         }

        //         else if (attendance?.attendanceType === "FieldWork") {
        //             obj.status = 'Field Work'
        //         }

        //         else if (attendance?.attendanceType === "Leave") {
        //             obj.status = "On Leave"
        //             obj.leaveType = attendance.leaveType
        //             if (attendance?.isHalfDay) {
        //                 obj.half = attendance.leaveHalf
        //                 obj.leaveHalf = attendance.leaveHalf
        //             }

        //         }

        //         obj.startTime = attendance?.startTime

        //         if (attendance.endTime) obj.endTime = attendance.endTime

        //         if (!attendance?.endTime && attendance?.attendanceType === "InOffice") {
        //             obj.status = "In Office"
        //         } else if (attendance?.endTime && attendance?.attendanceType === "InOffice") {
        //             obj.status = "Left Office"
        //         }

        //         const type = attendance.attendanceType;

        //         if (type != "In Office" && type != "Left Office" && type != "Leave" && type != "Field Work" && type != "WFH") {
        //             obj.status = "Status Unknown"
        //         }

        //         emp.push(obj);
        //     }

        // }, Promise.resolve())

        //console.log(emp)

        return res.status(200).json({
            status: true,
            report: report
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.toString()
        });
    }
}