const express = require("express");
const router = express.Router();

const {createNewEmployee} = require("../controllers/Employee/createNewEmployee");
const {getListOfEmployee} = require("../controllers/Employee/getListOfEmployee");
const {getEmployeeByEmployeeId} = require("../controllers/Employee/getEmployeeByEmployeeId");
const {updateEmployeeByEmployeeId} = require("../controllers/Employee/updateEmployeeByEmployeeId");

router.post("/createNewEmployee", createNewEmployee);
router.post('/updateEmployeeByEmployeeId',updateEmployeeByEmployeeId);
router.get('/getListOfEmployee',getListOfEmployee);
router.get('/getEmployeeByEmployeeId/:employeeId',getEmployeeByEmployeeId);


module.exports=router

