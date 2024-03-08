//write a schema for the course
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseId: {
        type: String
    },//COURSE-Counter

    courseCode: {
        type: String,
    },//User Input

    isActive: {
        type: Boolean,
        default: true
    },
    
    parentSchoolId: {
        type: String
    },
    parentDepartmentId: {
        type: String
    },


    courseName: {
        type: String
    },
    courseShortDesc: {
        type: String,
        dafault:"To be added"
    },
    courseDesc: {
        type: String,
        dafault:"To be added"
    },
    intake: [{
        totalCount: String,
        availableCount: String,
        cycle: String
    }],
    isCourseLevelCommission: {
        type: Boolean,
        default: false
    },
    commisionValue: {
        type: Number,
        default : 0
    }
}
, {
    timestamps: true
});
const Course = mongoose.model('Course', courseSchema)
module.exports = Course
