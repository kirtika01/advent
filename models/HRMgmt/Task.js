const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    taskID:{
        type:String,
        required:true,
        unique:true
    },   
    taskStatus:{
        type:String,
        default:"Open"
    },  //Open, Blocked, Closed
    taskType:{
        type:String,
        required:true //ToDo,Reminder
    },
    taskCategory:{
        type:String,
        default:"Automated"
    },//"Automated", "Manual"
    taskRole:{
        type:String
    },
    taskTitle:{
        type:String
    },
    taskDescription:{
        type:String
    },
    dueDate:{
        type:Date
    },
    isDue:{

        type:Boolean,
        default:false
    },
    assigneeUserName:{
        type:String
    },
    assigneeUserFullName:{
        type: String
    },
    assigneeEmpId:{
        type:String
    },
    delegationComment:{
        type:String
    },
    supervisorUserName:{
        type:String
    },
    createdByUserName:{
        type:String
    },
    createdByUserFullName:{
        type:String
    },
    createdByEmpId:{
        type:String
    },
    closedByUserName:{
        type:String
    },
    
    closedByUserFullName:{
        type:String
    },
    closedByEmpId:{
        type: String
    },
    closedDate:{
        type:Date
    },
    closedReason:{
        type:String
    },
    
    identifier:{
        type:String
    },
    taskDue:{
        type:Boolean,
        default:false
    },

    comments:[{
        commentedBy:{
            type:String
        },
        comment:{
            type:String
        },
        commentDate:{
            type:Date,
            default:Date.now
        },
        commentType:{
            type:String
        }
    }]
},{
    timestamps:true
})


const Task = mongoose.model('Task', taskSchema)
module.exports = Task
