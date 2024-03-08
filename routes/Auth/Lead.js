const express = require("express");
const router = express.Router();

//Lead Routes

const {sendOTPLead} = require("../../controllers/Auth/Lead/sendOTPLead");
router.post("/sendOTPLead", sendOTPLead);

const {validateOTPLead} = require('../../controllers/Auth/Lead/validateOTPLead');
router.put('/validateOTPLead' , validateOTPLead);


module.exports=router