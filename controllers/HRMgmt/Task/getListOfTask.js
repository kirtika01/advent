const Task = require("../../../models/HRMgmt/Task");

const getListOfTask = async (req, res, next) => {

  try {

    // var taskType = req.query.taskType;
    // var taskRole = req.query.taskRole;
    // var taskDue = req.query.taskDue;
    // var userName = req.query.userName;
    // var taskStatus = req.query.taskStatus;
    // var category = req.query.category;

    var query = {}
    let matchOperator = {}

    if (req.query.taskType) {
      query["taskType"] = req.query.taskType
      matchOperator = {
        ...matchOperator,
        taskType: req.query.taskType
      }
    }

    if (req.query.taskRole) {
      query["taskRole"] = req.query.taskRole
      matchOperator = {
        ...matchOperator,
        taskRole: req.query.taskRole
      }
    }

    if (req.query.taskDue) {
      var temp = req.query.taskDue ==='true'? true:false
      query["taskDue"] = temp 
      matchOperator = {
        ...matchOperator,
        taskDue: temp
      }
    }

    if (req.query.assigneeUserName) {
      query["assigneeUserName"] = req.query.assigneeUserName
      matchOperator = {
        ...matchOperator,
        assigneeUserName: req.query.assigneeUserName
      }
    }
    if (req.query.closedByUserName) {
      query["closedByUserName"] = req.query.closedByUserName
      matchOperator = {
        ...matchOperator,
        closedByUserName: req.query.closedByUserName
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
    }

    if (query === null) {

      //console.log(query)

      var taskList = await Task.find()

      if (taskList.length > 0) {

        return res.status(200).json({
          status: true,
          taskList: taskList
        })

      }
      else {

        return res.status(200).json({
          status: false,
          message: "No Task available"
        })

      }

    }
    else {
      

      //console.log(query , 'query')
      //console.log(matchOperator , 'match')


      let taskList = await Task.aggregate([
        {
          $match: matchOperator
        }
      ])


      if (taskList.length > 0) {

        return res.status(200).json({
          status: true,
          length : taskList.length,
          taskList: taskList
          
        })

      }
      else {

        return res.status(200).json({
          status: false,
          message: "No Task Found."
        })

      }
    }


  }
  catch (err) {
    console.log(err)
    return res.status(500).json({
      status: false,
      error: err.toString()
    })
  }




};

module.exports = { getListOfTask };
