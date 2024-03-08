const Leave = require("../../../models/HRMgmt/Leave")
const Employee = require("../../../models/HRMgmt/Employee")
const Counter = require('../../../models/Counter')
const axios = require('axios');

exports.applyHalfDayLeave = async (req, res) => {
    let flag = 0


    try {

        let token = req.headers.authorization.split(' ')[1]

        var employee = await Employee.findOne({ employeeId: req.body.employeeId })

        if (!employee) {
            throw new Error("Employee with employeeId-" + req.body.employeeId + " not found.")
        }


        console.log("Hi::::::::::")


        let leaveType = req.body.leaveType
        let leaveCode = req.body.leaveCode

        let leaveDays = 0.5;
        let leaveCodeFound = false

        for (let i = 0; i < employee.leaveBalance.length; i++) {
            if (employee.leaveBalance[i].leaveCode === leaveCode) {
                leaveCodeFound = true
                if (employee.leaveBalance[i].balance < leaveDays) {
                    throw new Error(`Unable to apply ${leaveCode} as balance is low. Current balance-${employee.leaveBalance[i].balance}`)
                } else {
                    employee.leaveBalance[i].balance = employee.leaveBalance[i].balance - leaveDays
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
        var counter = await Counter.findOneAndUpdate({ identifierName: "Leave" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        flag = 1
        const leaveId = "LEAVE-" + counter.count;
        let leave = new Leave(req.body)
        leave.leaveId = leaveId;
        leave.employeeId = req.body.employeeId;
        leave.employeeFullName = employee.employeeFullName
        leave.lineManagerId = employee.lineManagerId
        leave.lineManagerName = employee.lineManagerName
        leave.leaveReason = req.body.leaveReason
        leave.leaveType = req.body.leaveType
        leave.leaveCode=leaveCode
        leave.noOfDays = leaveDays
        leave.leaveHalf = req.body.leaveHalf;
        leave.isHalfDay=true;

        //leaveStartDate = start at 10:30PM if leaveHalf = First
        //leaveEndDate = end at 4:00PM if leaveHalf = Second
        let leaveStartDate = new Date(req.body.leaveDate)
        let leaveEndDate = new Date(req.body.leaveDate)

        if (req.body.leaveHalf === "First") {
            leaveStartDate.setHours(5, 0, 0, 0)
            leaveEndDate.setHours(9, 30, 0, 0)
        }
        if (req.body.leaveHalf === "Second") {
            leaveStartDate.setHours(9, 0, 0, 0)
            leaveEndDate.setHours(11, 30, 0, 0)
        }
        
        leave.leaveStartDate = leaveStartDate
        leave.leaveEndDate = leaveEndDate


        const result = await leave.save()
        if (result) {


            // send notification


            url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
            let sendNotify = await axios.post(url, {
                "notificationAudience": "Personal",
                "notificationHeadline": "Half Day Leave Applied - " + employee.employeeFullName,
                "notificationBody": "Half Day Leave Applied - " + leave.leaveType + " by - " + employee.employeeFullName,
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
                leave: result,
                leaveId: result.leaveId
            })
        }
        else {
            throw new Error("Unable to create Leave ")
        }
    }
    catch (err) {
        console.log(err)
        if (flag === 1) {
            var counter = await Counter.findOneAndUpdate({ identifierName: "Leave" }, { $inc: { count: -1 } }, { upsert: true, returnNewDocument: true })
        }
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}