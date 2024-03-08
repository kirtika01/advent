const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({


    courseId : {
        type:String
    },//CRS-<SchoolId>-4 Char Course Code

    isActive:{
        type:Boolean,
        default:true
    },

    courseName:{
        type:String
    },
    courseShortDesc:{
        type:String
    },
    courseDesc:{
        type:String
    },
    intake:[{

        totalCount:String,
        availableCount:String,
        cycle:String
    }],

    


    isCourseLevelCommission:{
        type:Boolean,
        default:false
    },

    commisionValue:{
        type:Number
    },

    commissionType:{
        type:String //Percentage , Fixed
    },

    duration:{
        type:Number //in months
    },
    termType:{
        type:String //Year, Semester, Trimester
    },
    parentSchoolId:{
        type:String
    },

    isActive: {
        type: Boolean,
        default: true
    },

    courseCode:{
        type:String
    }



}, {
    timestamps: true
})



const Course = mongoose.model('Course', courseSchema)
module.exports = Course