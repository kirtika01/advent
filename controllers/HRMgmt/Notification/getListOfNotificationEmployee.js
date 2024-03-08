const Notification = require('../../../models/HRMgmt/Notification')
const Employee = require('../../../models/HRMgmt/Employee')
moment = require('moment-timezone')

exports.getListOfNotificationEmployee = async (req, res) => {
    try {

        let employee = await Employee.findOne({employeeId:req.query.employeeId,isActive:true})

        if (!employee) {
            throw new Error(`Employee ${req.query.employeeId} Not Found`)
        }


        let query = {}
        let result = []
        let notificationList
        let startOfToday
        let thirtyDays


        query["notificationCategory"] = "Employee"

        if (req.query.isPriority === true || req.query.isPriority === "true") {
            query["isPriority"] = true
        }


        if (req.query.isToday === true || req.query.isToday === "true") {
            startOfToday = new Date()
            startOfToday.setUTCHours(0, 0, 0, 0)
            query["notificationDate"] = { $gte: new Date(startOfToday) }
        }


        if (req.query.isToday === false || req.query.isToday === "false") {
            let today = new Date()
            today.setDate(today.getDate() - 30)
            today.setUTCHours(0, 0, 0, 0)
            query["notificationDate"] = { $gte: new Date(today) }
        }



        if (req.query.notificationAudience === "Organisation") {
            query["notificationAudience"] = "Organisation"
            result = await Notification.find(query)
        }


        if (req.query.notificationAudience === "Squad") {
            query["notificationAudience"] = "Squad"
            query['employeeId'] = employee.employeeId

            result = await Notification.find(query)

        }
        if (req.query.notificationAudience === "Personal") {
            query["notificationAudience"] = "Personal"
            query['employeeId'] = employee.employeeId

            result = await Notification.find(query)

        }

        if (req.query.notificationAudience === "All") {


            query['employeeId'] = employee.employeeId

            notificationList = await Notification.find(query)

            query = {}

            query["notificationCategory"] = "Employee"

            if (req.query.isToday === true || req.query.isToday === "true") {
                startOfToday = new Date()
                startOfToday.setUTCHours(0, 0, 0, 0)
                query["notificationDate"] = { $gte: new Date(startOfToday) }
            }


            if (req.query.isToday === false || req.query.isToday === "false") {

                let today = new Date()
                today.setDate(today.getDate() - 30)
                today.setUTCHours(0, 0, 0, 0)
                query["notificationDate"] = { $gte: new Date(today) }

            }//Seema Refactor

            query["notificationAudience"] = "Organisation"


            result = await Notification.find(query)

            result = result.concat(notificationList)


        }


        if (result.length > 0) {

            return res.status(200).json({
                status: true,
                notificationList: result
            })

        }
        else {

            return res.status(200).json({
                status: false,
                message: "No Notification available"
            })

        }


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }

}