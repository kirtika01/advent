const express = require("express");
const router = express.Router();




//route for assignCounsellorToLead
const { assignCounsellorToLead } = require("../../controllers/LeadMgmt/Processor/assignCounsellorToLead");
router.put("/assignCounsellorToLead", assignCounsellorToLead);

//route for assignSSEToLead
const { assignSSEToLead } = require("../../controllers/LeadMgmt/Processor/assignSSEToLead");
router.put("/assignSSEToLead", assignSSEToLead);

//route for assignProcessExecutiveToLead
const { assignProcessExecutiveToLead } = require("../../controllers/LeadMgmt/Processor/assignProcessExecutiveToLead");
router.put("/assignProcessExecutiveToLead", assignProcessExecutiveToLead);

//route for getLeadProcessors
const { getLeadProcessors } = require("../../controllers/LeadMgmt/Processor/getLeadProcessors");
router.get("/getLeadProcessors/:leadId", getLeadProcessors);



module.exports = router