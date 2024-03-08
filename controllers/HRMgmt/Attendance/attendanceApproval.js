const Attendance = require('../../../models/HRMgmt/Attendance');
const axios = require('axios');
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require('moment-timezone');

exports.attendanceApproval = async (req, res) => {

    try {

        let attendance = await Attendance.findOne({ attendanceId: req.body.attendanceId });

        if (!attendance) {
            return res.status(200).json({
                status: false,
                message: `Attendance - ${req.body.attendanceId} does not exist in the records.`
            })
        }

        let employee = await Employee.findOne({ employeeId: attendance.employeeId });

        if (!employee) {
            return res.status(200).json({
                status: false,
                message: `Employee of the attendance - ${attendance.attendanceId} does not exist.`
            })
        }

        if (req.body.isApproved==="true"||req.body.isApproved===true) {

            attendance.attendanceStatus = 'Approved';

            const approvalDate = moment.tz(new Date(), "Asia/Kolkata");
            attendance.approvalDate = approvalDate
        } else {

            if (req.body.selfRejected===true|| req.body.selfRejected === "true") {
                attendance.selfRejected = true
               
            }
            attendance.attendanceStatus = 'Rejected' 
            attendance.rejectionReason = req.body.rejectionReason
            if (attendance.attendanceType == 'WFH') {
                employee.wfhBalance = employee.wfhBalance + attendance.totalHours;
            }

           
        }


       

        let date = `${new Date(attendance.startTime).getDate()}/${new Date(attendance.startTime).toLocaleString('default', { month: 'short' })}/${new Date(attendance.startTime).getFullYear()}`

        let doc = await attendance.save();


        if (doc) {

            let url = process.env.URL + '/api/v1/utils/sendEmail'
            let subject = `Attendance Record ${attendance.attendanceId} dated ${date}`;

            //let timeApproved = new Date(attendance.endTime).getHours() - new Date(attendance.startTime).getHours();
            let diffTime = Math.abs(new Date(attendance.startTime) - new Date(attendance.endTime));
            let timeApproved = Math.round(((diffTime/(1000*60))/60)*10)/10
            
            

            let updateEmployee = await employee.save();

            if (updateEmployee) {

                let text;
                if (attendance.attendanceStatus === 'Approved') {
                    text = `Hi ${employee.employeeFirstName} ${employee.employeeLastName}, \n \n Your attendance Type: ${attendance.attendanceType} for  ${date} is ${attendance.attendanceStatus} by your Manager ${employee.lineManagerName}. Total time approved is ${timeApproved} hrs.`
                } else {
                    text = `Hi ${employee.employeeFirstName} ${employee.employeeLastName}, \n \n Your attendance Type: ${attendance.attendanceType} for  ${date} is ${attendance.attendanceStatus} by your Manager ${employee.lineManagerName}.`
                }

                let mailSent = await axios.post(url, {
                    to: employee.officialEmail,  // Change to email address that you want to receive messages on
                    subject: subject,
                    text: text
                })

                if (mailSent.status === 200) {

                    return res.status(200).json({
                        status: true,
                        message: `Attendance of ${req.body.attendanceId} successfully updated for ${date}`
                    })

                } else {

                    throw new Error(`Could not update WFH balance of employee - ${employee.employeeId}. Attendance Updated.`)

                }


            } else {
                throw new Error(mailSent.error.response.error);
            }

        } else {
            throw new Error('Unable to update the attendnace.')
        }


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}