const Leave = require("../../../models/HRMgmt/Leave")
const Employee = require("../../../models/HRMgmt/Employee")
const Counter = require('../../../models/Counter')
const axios = require('axios');



exports.applyLeave = async (req, res) => {
    let flag = 0


    let token = req.headers.authorization.split(' ')[1]

    try {

        
        let employee = await Employee.findOne({ employeeId: req.body.employeeId })

        if (!employee) {
            throw new Error("Employee with employeeId-" + req.body.employeeId + " not found.")
        }

        let leave

        if (employee) {
            console.log("Hi::::::::::")

            let startDate = new Date(req.body.leaveStartDate)
            let endDate = new Date(req.body.leaveEndDate)
            let leaveType = req.body.leaveType
            let leaveCode = req.body.leaveCode
            console.log("startDate::" + startDate)
            console.log("EndDate::" + endDate)

            // To calculate the time difference of two dates
            let differenceInTime = endDate.getTime() - startDate.getTime();

            // To calculate the no. of days between two dates
            console.log("differenceInTime" + differenceInTime)
            // let differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;
            // let differenceInDays = Math.round(differenceInTime / (24 * 60 * 60 * 1000));
            let differenceInDays = (endDate.getDate() - startDate.getDate()) + 1;

            //if leavetype not in employee leave balance throw error
            let leaveCodeFound = false


            for (let i = 0; i < employee.leaveBalance.length; i++) {
                if (employee.leaveBalance[i].leaveCode === leaveCode) {
                    leaveCodeFound = true
                    if (employee.leaveBalance[i].balance < differenceInDays) {
                        throw new Error(`Unable to apply ${leaveCode} as balance is low. Current balance-${employee.leaveBalance[i].balance}`)
                    } else {
                        employee.leaveBalance[i].balance = employee.leaveBalance[i].balance - differenceInDays
                    }
                }
            }
            if (leaveCodeFound==false) {
                throw new Error(`Leave Type ${leaveType} not found in employee leave balance`)
            }

            let doc = await employee.save();

            if (!doc) {
                throw new Error(`Unable to update ${leaveType} balance`)
            }
            let counter = await Counter.findOneAndUpdate({ identifierName: "Leave" }, { $inc: { count: 1 } }, { upsert: true, new: true })
            
            const leaveId = "LEAVE-" + counter.count;
            flag = 1
            leave = new Leave(req.body)
            leave.leaveId = leaveId;
            leave.employeeId = req.body.employeeId
            leave.employeeFullName = employee.employeeFullName
            leave.leaveReason = req.body.leaveReason
            leave.lineManagerId = employee.lineManagerId
            leave.lineManagerName = employee.lineManagerName
            leave.leaveStartDate = startDate
            leave.leaveEndDate = endDate
            leave.applicationDate = new Date()
            console.log("differenceInDays::::::" + differenceInDays)
            leave.noOfDays = differenceInDays
            leave.leaveType = req.body.leaveType
            leave.leaveCode = leaveCode
            

            const result = await leave.save()
            if (result) {

                //send notification


                url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
                let sendNotify = await axios.post(url, {
                    "notificationAudience": "Personal",
                    "notificationHeadline": "Leave Applied - " + leave.leaveType,
                    "notificationBody": "Leave Applied - " + leave.leaveType + " by - " + employee.employeeFullName,
                    "employeeId": employee.lineManagerId,
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

                return res.status(200).json({
                    status: true,
                    message: "Leave Created Successfully",
                    leaveId: result.leaveId,
                    leave: result
                })
            }
            else {
                
                throw new Error("Unable to create Leave ")
            }

        }
    }

    catch (err) {
        console.log(err)
        if (flag) {
            let counter = await Counter.findOneAndUpdate({ identifierName: "Leave" }, { $inc: { count: -1 } }, { upsert: true, returnNewDocument: true })
        }

        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}