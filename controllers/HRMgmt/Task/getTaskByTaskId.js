const Task = require('../../../models/HRMgmt/Task')

const getTaskByTaskId = async (req, res, next) => {

    try{

        var task = await Task.findOne({taskID:req.params.taskID})

        if(task){

            return res.status(200).json({
                status:true,
                task:task
            })

        }
        else{

            throw new Error("Unable to find Task")

        }

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    } 


    
}

module.exports={getTaskByTaskId}