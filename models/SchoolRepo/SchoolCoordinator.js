const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolCoordinatorSchema = new Schema({


    coordinatorId:String, //if type = School
    employeeId:String, //If Type = Advent

    coordinatorType:String, //Advent, School
    schoolCode:String,

    schoolName





}, {
    timestamps: true
})



const SchoolCoordinator = mongoose.model('SchoolCoordinator', schoolCoordinatorSchema)
module.exports = SchoolCoordinator