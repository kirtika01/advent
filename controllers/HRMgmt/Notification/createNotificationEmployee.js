const Notification = require('../../../models/HRMgmt/Notification')
const Counter = require('../../../models/Counter')
const Employee = require('../../../models/HRMgmt/Employee')
const firebaseAdmin = require("firebase-admin");


exports.createNotificationEmployee = async (req, res, next) => {

    let counterIncremented = false

    try {


        let notificationCategory = "Employee"

        let notificationDate = new Date()
        console.log(notificationDate)



        if (req.body.notificationAudience === "Organisation") {

            var counter = await Counter.findOneAndUpdate({ identifierName: "OrgNotification" }, { $inc: { count: 1 } }, { upsert: true, new: true })
            counterIncremented = true

            var notification = new Notification(req.body)
            notification.notificationCategory = notificationCategory
            notification.notificationId = "NT-" + counter.count
            notification.notificationDate = notificationDate
            notification.notificationAudience = "Organisation"
            
            const result = await notification.save()
            if (!result) {
                throw new Error("unable to send new Notification")
            }


            var listOfEmployee = await Employee.find({ isActive: true })

            console.log("No of Employee:",listOfEmployee.length)

            await listOfEmployee.reduce(async (promise, employee) => {

                await promise;

                
                await sendFCMNotification(employee, req.body.notificationHeadline, req.body.notificationBody)

            }, Promise.resolve());

            return res.status(200).json({
                status: true,
                message: "Successfully sent Notification",


            })

        }

        if (req.body.notificationAudience === "Squad") {

            //const result=await notification.save()
            var listOfEmployee = await Employee.find({ isActive: true, squads: { $elemMatch: { squadCode: req.body.squadCode } } })
            console.log(listOfEmployee.length)
            if (listOfEmployee.length === 0) {
                throw new Error("No Employee found in the squad")
            }

            await listOfEmployee.reduce(async (promise, employee) => {

                await promise;

                var counter = await Counter.findOneAndUpdate({ identifierName: "SquadNotification" }, { $inc: { count: 1 } }, { upsert: true, new: true })
                counterIncremented = true

                var notification = new Notification(req.body)
                notification.notificationCategory = notificationCategory
                notification.notificationId = "NT-" + counter.count
                notification.notificationDate = new Date(notificationDate)
                notification.notificationAudience = "Squad"
                notification.squadCode = req.body.squadCode
                notification.employeeId = employee.employeeId

                const result = await notification.save()
                if (!result) {
                    throw new Error("unable to add new Notification")
                }
                await sendFCMNotification(employee, req.body.notificationHeadline, req.body.notificationBody)

            }, Promise.resolve());

            return res.status(200).json({
                status: true,
                message: "Successfully added Notification",


            })
        }
        if (req.body.notificationAudience === "Personal") {

            let checkEmployee = await Employee.findOne({ employeeId: req.body.employeeId })
            if (!checkEmployee) {
                throw new Error("Invalid Employee Id")
            }

            var counter = await Counter.findOneAndUpdate({ identifierName: "PersonalNotification" }, { $inc: { count: 1 } }, { upsert: true, new: true })
            counterIncremented = true

            var notification = new Notification(req.body)
            notification.notificationCategory = notificationCategory
            notification.notificationId = "NT-" + counter.count
            notification.notificationDate = new Date(notificationDate)
            notification.notificationAudience = "Personal"
            notification.employeeId = req.body.employeeId

            const result = await notification.save()
            if (result) {
                

                await sendFCMNotification(checkEmployee, req.body.notificationHeadline, req.body.notificationBody)


                return res.status(200).json({
                    status: true,
                    message: "Successfully added Notification",


                })
            } else {
                throw new Error("unable to add new Notification")
            }
        }
        throw new Error("Invalid Audience")



    }
    catch (err) {

        if(counterIncremented==true){

            if (req.body.notificationAudience === "Organisation") {
                counter = await Counter.findOneAndUpdate({ identifierName: "OrgNotification" }, { $inc: { count: -1 } }, { new: true })
            }
            if (req.body.notificationAudience === "Squad") {
                counter = await Counter.findOneAndUpdate({ identifierName: "SquadNotification" }, { $inc: { count: -1 } }, { new: true })
            }
            if (req.body.notificationAudience === "Personal") {
                counter = await Counter.findOneAndUpdate({ identifierName: "PersonalNotification" }, { $inc: { count: -1 } }, { new: true })
            }

        }
        
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }



}

const sendFCMNotification = async (employee, title, body) => {

    try {

        let messagingPayload



        messagingPayload = {
            notification: {
                title: title,
                body: body,

            },

        };


        firebaseAdmin.messaging().sendToDevice(employee.deviceToken, messagingPayload)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log(error)
                throw new Error('Error sending message:', error);
            })

    }
    catch (err) {
        console.log(err)
        return false
    }






}
