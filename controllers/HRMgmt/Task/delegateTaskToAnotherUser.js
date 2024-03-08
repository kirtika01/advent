const Task = require('../../../models/HRMgmt/Task')
const Employee = require('../../../models/HRMgmt/Employee');
const User = require('../../../models/User');
const axios = require('axios')
const firebaseAdmin = require("firebase-admin");


exports.delegateTaskToAnotherUser = async (req, res) => {

    try {

        let token = req.headers.authorization.split(' ')[1]
        

        var { taskID, assigneeUserName, delegationComment } = req.body

        let employee = await Employee.findOne({ userName:assigneeUserName })

        if (!employee) {
            throw new Error(`Employee ${assigneeUserName} not found. Contact Administrator`)
        }

        var task = await Task.findOne({ taskID: taskID, taskStatus: "Open" })
        if (task) {

            if (task.taskCategory === "Automated") {
                throw new Error(`Cannot delegate Automated Task ${taskID}.`)
            }
            var prevUserFullName = task.assigneeUserFullName
            task.taskID = taskID;
            task.assigneeUserName = assigneeUserName;
            task.assigneeUserFullName = employee.employeeFullName;
            task.delegationComment=delegationComment;
           

           

            var result = await task.save();

            if (result) {

                let title = "Task Delegated to you"
                let body = `Task ${taskID} has been delegated to you by ${prevUserFullName}.`
                
                // send notification
            
            
                url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
                let sendNotify = await axios.post(url, {
                    "notificationAudience": "TeamMember",
                    "notificationHeadline": title,
                    "notificationBody": body,
                    "employeeId": employee.employeeId
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'platform':'employeeMobile'
                    }
                })

                if (sendNotify.status!== 200) {

                    console.log("Unable to send notification.Contact Admininistrator")


                }

                return res.status(200).json({
                    status: true,
                    message: "Successfully delegated Task ::" + taskID + " to " + employee.employeeFullName,
                    task: task
                })


            } else {

                throw new Error(`Unable to delegate Task ${taskID}. Contact Administrator`)

            }


        } else {
            throw new Error(`Task ${taskID} not found. Contact Administrator`)
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

