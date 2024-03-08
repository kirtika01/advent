const express = require("express");
const router = express.Router();

//Employee Routes

const {sendOtpEmployee} = require("../../controllers/Auth/Employee/sendOtpEmployee");
router.post("/sendOtpEmployee", sendOtpEmployee);

const {validateOTPEmployee} = require('../../controllers/Auth/Employee/validateOTPEmployee');
router.post('/validateOTPEmployee' , validateOTPEmployee);







module.exports=router