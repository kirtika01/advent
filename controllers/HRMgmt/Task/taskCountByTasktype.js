const Task = require('../../../models/HRMgmt/Task')

const taskCountByTasktype = async (req, res, next) => {

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

        if (req.query.category) {
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

        if (query === null) {

            let taskList = await Task.aggregate([
                {
                    $group: { _id: "$taskType", count: { $sum: 1 } }
                }
            ])

            if (taskList.length > 0) {

                return res.status(200).json({
                    status: true,
                    taskCountByTasktype: taskList
                })

            }
            else {

                return res.status(200).json({
                    status: true,
                    Message: "No Task Found"
                })

            }

        } else {

            let taskList = await Task.aggregate([
                {
                    $match: matchOperator
                },
                {
                    $group: { _id: "$taskType", count: { $sum: 1 } }
                }
            ])


            if (taskList.length > 0) {

                return res.status(200).json({
                    status: true,
                    taskCountByTasktype: taskList,
                    length: taskList.length
                })

            }
            else {

                return res.status(200).json({
                    status: true,
                    Message: "No Task available for Query ::" + query.toString
                })

            }
        }
        // var today = new Date(),
        //     oneDay = (1000 * 60 * 60 * 24),
        //     thirtyDays = new Date(today.valueOf() - (30 * oneDay)),
        //     oneYear = new Date(today.valueOf() - (365 * oneDay))

        // if (req.query.chartFilter === "Open") {
        //     var taskCountByTasktype = await Task.aggregate([
        //         {
        //             "$match": {
        //                 taskStatus: "Open"
        //             }
        //         },
        //         { $group: { _id: "$taskType", count: { $sum: 1 } } }
        //     ])

        // }
        // if (req.query.chartFilter === "thirtyDays") {

        //     var taskCountByTasktype = await Task.aggregate([
        //         {
        //             "$match": {
        //                 "createdAt": { "$lte": thirtyDays }, taskStatus: "Closed"
        //             }
        //         },
        //         { $group: { _id: "$taskType", count: { $sum: 1 } } }
        //     ])

        // }
        // if (req.query.chartFilter === "oneYear") {

        //     var taskCountByTasktype = await Task.aggregate([
        //         {
        //             "$match": {
        //                 "createdAt": { "$lte": oneYear }, taskStatus: "Closed"
        //             }
        //         },
        //         { $group: { _id: "$taskType", count: { $sum: 1 } } }
        //     ])

        // }


        //console.log(taskCountByTasktype)

        // return res.status(200).json({
        //     status: true,
        //     chartFilter: req.query.chartFilter,
        //     taskCountByTasktype: taskCountByTasktype
        // })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }



}

module.exports = { taskCountByTasktype }