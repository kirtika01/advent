const Task = require('../../../models/HRMgmt/Task')
const Counter = require('../../../models/Counter')
const Employee= require("../../../models/HRMgmt/Employee")
const axios = require('axios')
const firebaseAdmin = require("firebase-admin");


const createNewTask = async (req, res, next) => {

    try{

        let token = req.headers.authorization.split(' ')[1]
        
        var counter= await Counter.findOneAndUpdate({identifierName: "Task"}, {$inc: {count: 1}}, {upsert: true,  new:true})
        var task = req.body
        task.taskID = 'TI-' + counter.count

        var createdByEmployee= await Employee.findOne({ userName: req.body.createdByUserName })
        //console.log(createdByEmployee)
        if (!createdByEmployee){
            throw new Error("Unable to find Employee- for Creation")
           
        }
        
        var assignedEmployee= await Employee.findOne({userName: req.body.assigneeUserName })
        if (!assignedEmployee){
            throw new Error("Unable to find Employee- for Assignment")
        }
       
        
        var task = req.body
        task.taskID = 'TI-' + counter.count
        task.createdByUserName=req.body.createdByUserName
        task.createdByUserFullName=createdByEmployee.employeeFullName
        task.createdByEmpId=createdByEmployee.employeeId

        task.assigneeUserName= req.body.assigneeUserName
        task.assigneeUserFullName=assignedEmployee.employeeFullName
        task.assigneeEmpId=assignedEmployee.employeeId
           

        

        var taskObj=new Task(task)
        var result=await taskObj.save()

        if(task.assigneeUserName!==task.createdByUserName){

            let title = "New Task Assigned - "+task.taskTitle
            let body = `Task ${task.taskID} has been assigned to you by ${createdByEmployee.employeeFullName}.`
            let assignEmployee = await Employee.findOne({ userName: task.assigneeUserName })
            
            // send notification
            
            
            url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
            let sendNotify = await axios.post(url, {
                "notificationAudience": "TeamMember",
                "notificationHeadline": title,
                "notificationBody": body,
                "employeeId": assignEmployee.employeeId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'platform':'employeeMobile'
                }
            })

            if (sendNotify.status!== 200) {

                console.log("Unable to send notification.Contact Admininistrator")


            }

        }
        if (result){
            res.status(200).json({
                status:true,
                taskId:result.taskID,
                message: `${result.taskID} created successfully!`
            })

        }
        else{
            
            throw new Error("Unable to create Task")

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



        
module.exports={createNewTask}