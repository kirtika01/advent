const express = require("express");
const router = express.Router();


//route for pullLead
const { pullLead } = require("../../controllers/LeadMgmt/LeadProcessing/pullLead");
router.put("/pullLead", pullLead);

//route for assignLead
const { assignLead } = require("../../controllers/LeadMgmt/LeadProcessing/assignLead");
router.put("/assignLead", assignLead);

//route for checkExisitingLead
const { checkExisitingLead } = require("../../controllers/LeadMgmt/LeadProcessing/checkExisitingLead");
router.post("/checkExisitingLead", checkExisitingLead);

//route for reOpenLead
const { reOpenLead } = require("../../controllers/LeadMgmt/LeadProcessing/reOpenLead");
router.put("/reOpenLead", reOpenLead);

//get Lead by Lead ID
const { getLeadByLeadId } = require("../../controllers/LeadMgmt/LeadProcessing/getLeadByLeadId");
router.get("/getLeadByLeadId/:leadId", getLeadByLeadId);

//route for addCommentToLead
const { addCommentToLead } = require("../../controllers/LeadMgmt/LeadProcessing/addCommentToLead");
router.put("/addCommentToLead", addCommentToLead);

//route for getLeadByCounsellor
const { getLeadByCounsellor } = require("../../controllers/LeadMgmt/LeadProcessing/getLeadByCounsellor");
router.get("/getLeadByCounsellor/:employeeId", getLeadByCounsellor);

//route for getListOfLeads
const { getListOfLeads } = require("../../controllers/LeadMgmt/LeadProcessing/getListOfLeads");
router.get("/getListOfLeads", getListOfLeads);

//route for getListOfLeadsToday
const {getListOfLeadsToday} = require("../../controllers/LeadMgmt/LeadProcessing/getListOfLeadsToday");
router.get("/getListOfLeadsToday", getListOfLeadsToday);

//route for getLeadByStatus
const { getLeadQueueDetails } = require("../../controllers/LeadMgmt/LeadProcessing/getLeadQueueDetails");
router.get("/getLeadQueueDetails", getLeadQueueDetails);


module.exports = router