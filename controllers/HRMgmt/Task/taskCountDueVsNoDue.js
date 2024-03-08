const Task = require('../../../models/HRMgmt/Task')

const taskCountDueVsNoDue = async (req, res, next) => {

    try {

        var query = {}
        let matchOperator = {}

        if (req.query.userName) {
            query["userName"] = req.query.userName
            matchOperator = {
                ...matchOperator,
                userName: req.query.userName
            }
        }

        if (req.query.taskCategory) {
            query["taskCategory"] = req.query.taskCategory
            matchOperator = {
                ...matchOperator,
                taskCategory: req.query.taskCategory
            }
        }

        if (req.query.taskStatus) {

            if (req.query.taskStatus === "Open") {
                query["taskStatus"] = { $in: ["Open", "Assigned", "InProgress", "ReOpened"] }
                matchOperator = {
                    ...matchOperator,
                    taskStatus: { $in: ["Open", "Assigned", "InProgress", "ReOpened"] }
                }
            }
            else {
                query["taskStatus"] = { $in: ["Closed"] }
                matchOperator = {
                    ...matchOperator,
                    taskStatus: { $in: ["Closed"] }
                }
            }
        }

        if (req.query.noOfDays) {
            query['noOfDays'] = req.query.noOfDays

            if (req.query.noOfDays === 7 || req.query.noOfDays === '7') {
                matchOperator = {
                    ...matchOperator,
                    createdAt: {
                        $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
                    }
                }
            }

            else if (req.query.noOfDays === 30 || req.query.noOfDays === '30') {
                matchOperator = {
                    ...matchOperator,
                    createdAt: {
                        $gte: new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))
                    }
                }
            }

            else if (req.query.noOfDays === 120 || req.query.noOfDays === '120') {
                matchOperator = {
                    ...matchOperator,
                    createdAt: {
                        $gte: new Date((new Date().getTime() - (120 * 24 * 60 * 60 * 1000)))
                    }
                }
            }
        }

        let dueMatchOperator = {
            ...matchOperator,
            taskDue: true
        }

        let noDueMatchOperator = {
            ...matchOperator,
            taskDue: false
        }

        let taskDueList = await Task.aggregate([
            {
                $match: dueMatchOperator
            },

            { $group: { _id: "$taskType", count: { $sum: 1 } } },

        ])


        let taskNoDueList = await Task.aggregate([
            {
                $match: noDueMatchOperator
            },

            { $group: { _id: "$taskType", count: { $sum: 1 } } },

        ])

        let taskDueTotalCount = 0;

        taskDueList.forEach((task) => {
            taskDueTotalCount += task.count
        })

        let taskNoDueTotalCount = 0;

        taskNoDueList.forEach((task) => {
            taskNoDueTotalCount += task.count
        })

        return res.status(200).json({
            status: true,
            taskDue: taskDueList,
            taskDueTotalCount,
            taskNoDue: taskNoDueList,
            taskNoDueTotalCount
        })

       
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }



}

module.exports = { taskCountDueVsNoDue }