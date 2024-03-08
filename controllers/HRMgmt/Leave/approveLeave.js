const Leave = require("../../../models/HRMgmt/Leave")
const Employee = require("../../../models/HRMgmt/Employee")
const axios = require('axios')

exports.approveLeave = async (req, res) => {

    try {

        var token = req.headers.authorization.split(" ")[1];


        var leave = await Leave.findOne({ leaveId: req.body.leaveId })
        if (!leave) {
            throw new Error(" Unable to find Leave. Contact Administrator")
        }
        if (leave.applicationStatus != 'Applied') {
            throw new Error(`Application status is ${leave.applicationStatus}`)
        }

        if (req.body.isApproved === true || req.body.isApproved === "true") {

            leave.applicationStatus = "Approved"
            leave.approvalDate = new Date()
            leave.approvalComment = req.body.approvalComment

            var employee = await Employee.findOne({ employeeId: leave.employeeId })

            if (!employee) {
                throw new Error(" Unable to find Employee")
            }

            let url = process.env.URL + '/api/v1/hrmgmt/attendance/addLeaveAttendance';
            let startDate = leave.leaveStartDate;
            // new Date(startDate).getDate() + 1;

            if (leave.noOfDays === 0.5) {

                let attendance = await axios.post(url, {
                    employeeId: employee.employeeId,
                    employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
                    lineManagerId: employee.lineManagerId,
                    lineManagerName: employee.lineManagerName,
                    startDate: startDate,
                    leaveType: leave.leaveType,
                    isHalfDay: true,
                    leaveHalf: leave.leaveHalf,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'platform': 'employeeMobile'
                    }
                })

                if (!attendance) {
                    throw new Error(`Unable to add Leave attendance for ${startDate}`)
                }

            }
            else {

                var leaveStartDate = new Date(startDate)
                for (let i = 1; i <= leave.noOfDays; i++) {

                    let attendance = await axios.post(url, {
                        employeeId: employee.employeeId,
                        employeeName: `${employee.employeeFirstName} ${employee.employeeLastName}`,
                        lineManagerId: employee.lineManagerId,
                        lineManagerName: employee.lineManagerName,
                        startDate: leaveStartDate,
                        leaveType: leave.leaveType,
                        isHalfDay: false,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'platform': 'employeeMobile'
                        }
                    })

                    if (!attendance) {
                        throw new Error(`Unable to add Leave attendance for ${startDate}`)
                    }

                    leaveStartDate.setDate(leaveStartDate.getDate() + 1);
                }

            }

            //send notification


            url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
            let sendNotify = await axios.post(url, {
                "notificationAudience": "Personal",
                "notificationHeadline": `Leave Approved- ${leave.leaveType} for ${leave.noOfDays} Days`,
                "notificationBody": `Request for leave is approved. Leave Type: ${leave.leaveType}, No. of Days: ${leave.noOfDays}, Start Date:${leave.leaveStartDate} End Date: ${leave.leaveEndDate} `,
                "employeeId": employee.employeeId,
                "notificationPriority": "Normal"
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'platform': 'employeeMobile'
                }
            })

            if (sendNotify.status !== 200) {

                console.log("Unable to send notification")

            }



            url = process.env.URL + '/api/v1/utils/sendEmail'
            let subject = `Leave Approved- ${leave.leaveType} for ${leave.noOfDays} Days`;


            let text = `Hi ${employee.employeeFirstName}, \n \n Yor request for leave is approved. \n Leave Type: ${leave.leaveType}, \n No. of Days: ${leave.noOfDays}, \n Start Date:${leave.leaveStartDate} \n End Date: ${leave.leaveEndDate} `;



            let mailSent = await axios.post(url, {
                to: employee.officialEmail,  // Change to email address that you want to receive messages on
                subject: subject,
                text: text
            })

            if (mailSent.status === 200) {
                await leave.save()
                await employee.save()
                return res.status(200).json({
                    status: true,
                    message: `Leave of Employee Id: ${employee.employeeId} successfully approved`
                })
            }
            else {
                throw new Error("Unable to send Mail. Contact Administator")
            }
        }
        else if (req.body.isApproved === false || req.body.isApproved === "false") {

            if (req.body.isCancelled === true || req.body.isCancelled === "true") {
                leave.applicationStatus = "Rejected"

            }
            else {
                leave.applicationStatus = "Rejected"
            }

            leave.rejectionReason = req.body.rejectionReason || 'Cancelled by Self';

            var employee = await Employee.findOne({ employeeId: leave.employeeId })

            if (employee) {
                //add leave balance
                for (let i = 0; i < employee.leaveBalance.length; i++) {
                    if (employee.leaveBalance[i].leaveType === leave.leaveType) {
                        employee.leaveBalance[i].balance = employee.leaveBalance[i].balance + leave.noOfDays
                    }
                }
            }

            let doc = await employee.save();

            if (!doc) {
                throw new Error(`Could not Reject/Cancel the leave request ${leave.leaveId}`)
            }



            //send notification


            let url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
            let sendNotify = await axios.post(url, {
                "notificationAudience": "Personal",
                "notificationHeadline": `Leave Rejected- ${leave.leaveType} for ${leave.noOfDays} Days`,
                "notificationBody": `Request for leave is rejected. Leave Type: ${leave.leaveType}, No. of Days: ${leave.noOfDays}, Start Date:${leave.leaveStartDate} End Date: ${leave.leaveEndDate} `,
                "employeeId": employee.employeeId,
                "notificationPriority": "Normal"
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'platform': 'employeeMobile'
                }
            })

            if (sendNotify.status !== 200) {

                console.log("Unable to send notification")

            }

            url = process.env.URL + '/api/v1/utils/sendEmail'
            let subject = `Leave Rejected- ${leave.leaveType} for ${leave.noOfDays} Days`;

            let text

            if (req.body.isCancelled === true || req.body.isCancelled === "true") {
                text = `Hi ${employee.employeeFirstName}, \n \n Yor request for leave is cancelled. \n Leave Type: ${leave.leaveType}, \n No. of Days: ${leave.noOfDays}, \n Start Date:${leave.leaveStartDate} \n End Date: ${leave.leaveEndDate} \n Rejection Reason: Leave cancelled by employee`;

            }
            else {
                text = `Hi ${employee.employeeFirstName}, \n \n Yor request for leave is rejected. \n Leave Type: ${leave.leaveType}, \n No. of Days: ${leave.noOfDays}, \n Start Date:${leave.leaveStartDate} \n End Date: ${leave.leaveEndDate} \n Rejection Reason: ${leave.rejectionReason}`;

            }

            let mailSent = await axios.post(url, {
                to: employee.officialEmail,  // Change to email address that you want to receive messages on
                subject: subject,
                text: text
            })

            if (mailSent.status === 200) {
                await leave.save()

                if (req.body.isCancelled === true || req.body.isCancelled === "true") {

                    return res.status(200).json({
                        status: true,
                        message: `Leave of Employee Id: ${employee.employeeId} cancelled`
                    })



                }
                else {

                    return res.status(200).json({
                        status: true,
                        message: `Leave of Employee Id: ${employee.employeeId} rejected`
                    })
                }

            }
            else {
                throw new Error("Unable to send Mail. Contact Administator")
            }


        }
    }
    catch (err) {
        console.log(err)

        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}