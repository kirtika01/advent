const Task = require('../../../models/HRMgmt/Task')

const listOfTaskAssignedByMe = async (req, res, next) => {
    try {

        var query = {}
        query['createdByUserName'] = req.query.userName

        query['assigneeUserName'] = {$ne:req.query.userName}

        query['taskStatus'] = {$ne:"Closed"}


        let list;

        if (Object.keys(query).length > 0) {

            list = await Task.find(query);
        } else {
            list = null
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                listOftask: list,
                no : list.length
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Task found which is asigned by me',
               
            })
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

module.exports = { listOfTaskAssignedByMe };

