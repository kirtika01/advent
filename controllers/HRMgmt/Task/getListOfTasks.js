const Task = require("../../../models/HRMgmt/Task");

const getListOfTasks = async (req, res, next) => {

  try{

    var taskType = req.query.taskType
    var taskCategory = req.query.taskCategory
    var taskRole = req.query.taskRole
    var taskStatus = req.query.taskStatus
    var userName = req.query.userName
    var taskDue = req.query.taskDue
    var taskStatus = req.query.taskStatus
    var noOfDays = req.query.noOfDays

    var query={}

    if(taskType){
      query["taskType"]=taskType
    }
    if(taskCategory){
      query["taskCategory"]=taskCategory
    }
    if(taskRole){
      query["taskRole"]=taskRole
    }
    if(taskStatus){
      query["taskStatus"]=taskStatus
    }
    if(assigneeUserName){
      query["assigneeUserName"]=assigneeUserName
    }
    if(createdByUserName){
      query["createdByUserName"]=createdByUserName
    }
    if(taskDue){
      query["taskDue"]=taskDue
    }

    if(noOfDays===7){

    }

    if(noOfDays===30){

    }
    if(noOfDays==="All"){

    }
    /*if(taskStatus){
            
      if(taskStatus==="Open"){
          query["taskStatus"]={$in:["Open","Assigned","InProgress","ReOpened"]}
      }
      else{
          query["taskStatus"]={$in:["Closed"]}
      }
    }*/

    if(query===null){

      //console.log(query)

      var taskList = await Task.find()

      if (taskList.length>0){

        return res.status(200).json({
            status:true,
            taskList:taskList
        })

      }
      else{

        return res.status(200).json({
            status:true,
            Message:"No task available"
        })

      }
    
    }
    else{
      var taskList = await Task.find(query)
      console.log(taskList)

      console.log(query)


      if (taskList.length>0){

          return res.status(200).json({
              status:true,
              taskList:taskList
          })

      }
      else{

          return res.status(200).json({
              status:true,
              Message:"No Task Available available for Query ::"+query.toString
          })

      }
    }


  }
  catch(err){
    console.log(err)
    return res.status(500).json({
        status:false,
        error:err.toString()
    })
  } 
  

  
  
};

module.exports = { getListOfTasks };
