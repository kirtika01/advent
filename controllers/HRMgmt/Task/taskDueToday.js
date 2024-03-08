const Task = require('../../../models/HRMgmt/Task');

exports.taskDueToday = async (req, res) => {

    try {

        //console.log(new Date(new Date().setUTCHours(0,0,0,0)))
        //console.log(new Date(new Date().setUTCHours(23,59,59,999)))

        let matchOperator = {
            taskStatus: "Open",
            $and: [
                {
                    dueDate: { $gte: new Date(new Date().setHours(0,0,0,0)) }
                },
                {
                    dueDate: { $lte : new Date(new Date().setHours(23,59,59,999)) }
                }
            ]
           
        }

        if (req.query.assigneeUserName) {

            matchOperator = {
                ...matchOperator,
                assigneeUserName: req.query.assigneeUserName
            }
        }


        let taskList = await Task.aggregate([
            {
                $match: matchOperator
            }
        ])


        if (taskList.length > 0) {

            return res.status(200).json({
                status: true,
                taskList
            })

        }
        else {

            return res.status(200).json({
                status: false,
                message: "No Task available"
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