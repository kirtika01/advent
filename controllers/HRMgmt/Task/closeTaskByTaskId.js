const Task = require('../../../models/HRMgmt/Task')
//const mongoose = require('mongoose');
const moment = require('moment-timezone');


const closeTaskByTaskId = async(req, res, next) => {

    try{
        var task=await Task.findOne({taskID:req.body.taskID})

        if(task){
            task.taskStatus="Closed";
            task.closedByUserName=req.body.closedByUserName;
            task.closedByUserFullName=req.body.closedByUserFullName;
            task.closedByEmpId=req.body.closedByEmpId;
            task.closedDate= moment.tz(new Date(), "Asia/Kolkata");; 
            task.closedReason=req.body.closedReason
            await task.save();

            res.status(200).json({
                status:true,
                message:`Task successfully closed`
            })
        }
        else{
            throw new Error("Unable to close task. Contact Administrator")
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

module.exports={closeTaskByTaskId}