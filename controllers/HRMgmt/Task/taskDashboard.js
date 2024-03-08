const Task = require("../../../models/HRMgmt/Task");

const taskDashboard = async (req, res, next) => {

    try {


        let totalOpenTask = await Task.find({ taskStatus: { $in: ["Open", "Assigned", "InProgress", "ReOpened"] }, assigneeUserName : req.query.assigneeUserName})
        let totalOpenTaskCount = totalOpenTask.length
        let totalOpenDueTask = await Task.find({taskStatus: { $in: ["Open", "Assigned", "InProgress", "ReOpened"] },taskDue: true,assigneeUserName : req.query.assigneeUserName})
        let totalOpenDueTaskCount = totalOpenDueTask.length
        let listOfOpenTasksWithDueDateToday = await Task.aggregate([
            {
                $match: {
                    taskStatus: { $in: ["Open", "Assigned", "InProgress", "ReOpened"] },
                    taskDue: false,
                    assigneeUserName : req.query.assigneeUserName,
                    //// Previosuly used method that turned out to be wrong /////
                    // $and: [
                    //     {
                    //         dueDate: { $gte: new Date((new Date().getTime() - (1 * 24 * 60 * 60 * 1000))) }
                    //     },
                    //     {
                    //         dueDate: { $lte : new Date((new Date().getTime() - (0 * 24 * 60 * 60 * 1000))) }
                    //     }
                    // ]

                    ////// Actual correct way //////
                    $and: [
                        {
                            dueDate: { $gte: new Date(new Date().setUTCHours(0,0,0,0)) }
                        },
                        {
                            dueDate: { $lte : new Date(new Date().setUTCHours(23,59,59,999)) }
                        }
                    ]
                    
                }

            }
        ])

        //console.log(new Date((new Date().getTime() - (0 * 24 * 60 * 60 * 1000))))
        //console.log(totalOpenTask, totalOpenDueTask, listOfOpenTasksWithDueDateToday)

        return res.status(200).json({
            status : true,
            totalOpenTaskCount:totalOpenTaskCount ,
            totalOpenDueTaskCount:totalOpenDueTaskCount,
            listOfOpenTasksWithDueDateToday
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}

module.exports = { taskDashboard }