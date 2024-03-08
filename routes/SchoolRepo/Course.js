const express = require("express");
const router = express.Router();

const {createNewCourse} = require("../../controllers/SchoolRepo/Course/createNewCourse_old");
router.post("/createNewCourse", createNewCourse);

const {updateCourse} = require("../../controllers/SchoolRepo/Course/updateCourse");
router.put("/updateCourse", updateCourse);

const {getCourseByCourseId} = require("../../controllers/SchoolRepo/Course/getCourseByCourseId");
router.get("/getCourseByCourseId/:courseId", getCourseByCourseId);

const {getListOfcourses} = require("../../controllers/SchoolRepo/Course/getListOfcourses");
router.get("/getListOfcourses", getListOfcourses);


const {deleteCourseByCourseId} = require("../../controllers/SchoolRepo/Course/deleteCourseByCourseId");
router.post("/deleteCourseByCourseId", deleteCourseByCourseId);

const {activateCourseToggle} = require("../../controllers/SchoolRepo/Course/activateCourseToggle");
router.post("/activateCourseToggle", activateCourseToggle);

const {updateCourseLevelCommision} = require("../../controllers/SchoolRepo/Course/updateCourseLevelCommision");
router.post("/updateCourseLevelCommision", updateCourseLevelCommision);


const {addCourseIntake} = require("../../controllers/SchoolRepo/Course/addCourseIntake");
router.post("/addCourseIntake", addCourseIntake);

const {deleteCourseIntake} = require("../../controllers/SchoolRepo/Course/deleteCourseIntake");
router.post("/deleteCourseIntake", deleteCourseIntake);

const {updateCourseIntakeCount} = require("../../controllers/SchoolRepo/Course/updateCourseIntakeCount");
router.post("/updateCourseIntakeCount", updateCourseIntakeCount);


module.exports=router