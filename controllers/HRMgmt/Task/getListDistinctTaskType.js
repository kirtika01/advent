const Task = require('../../../models/HRMgmt/Task');

exports.getListDistinctTaskType = async (req, res) => {

    try {

        let query = {};

        if (req.query.userName) {
            query['userName'] = req.query.userName;
        }

        if(req.query.isOpen){

            console.log(req.query.isOpen)
            if(req.query.isOpen===true||req.query.isOpen==="true"){
                console.log("here")
                query['taskStatus'] =  {$ne:"Closed"}
            }
            else{
                query['taskStatus'] = "Closed"
            }
        }

        console.log(query)

        let distinctTaskType = await Task.distinct("taskType",query);

        console.log(distinctTaskType)

        if (distinctTaskType.length > 0) {

            return res.status(200).json({
                status: true,
                taskTypes : distinctTaskType
            })

        }
        else {

            return res.status(200).json({
                status: false,
                message: "No Task Types available"
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