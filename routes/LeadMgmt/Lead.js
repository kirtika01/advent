const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticateOTPTokens')



//Lead Capture

/*
const { createNewLeadWebFormTemp } = require("../../controllers/LeadMgmt/LeadCapture/createNewLeadWebFormTemp");
router.post("/leadCapture/createNewLeadWebFormTemp",createNewLeadWebFormTemp);

const { createNewLeadInBoundCall } = require("../../controllers/LeadMgmt/LeadCapture/createNewLeadInBoundCall");
router.post("/leadCapture/createNewLeadInBoundCall",createNewLeadInBoundCall);

//Lead Processing


const { getListOfLeadCommentByLeadId } = require("../../controllers/LeadMgmt/LeadProcessing/getListOfLeadCommentByLeadId");
router.get("/leadProcessing/getListOfLeadCommentByLeadId/:leadId", getListOfLeadCommentByLeadId);


const { updateLeadByLeadId } = require("../../controllers/LeadMgmt/LeadProcessing/updateLeadByLeadId");
router.put("/leadProessing/updateLeadByLeadId", updateLeadByLeadId);


const { getLeadQueueDetails } = require('../../controllers/LeadMgmt/LeadProcessing/getLeadQueueDetails');
router.get('/leadProcessing/getLeadQueueDetails/:queueName', getLeadQueueDetails)

const { getListOfLeadsToday } = require("../../controllers/LeadMgmt/LeadProcessing/getListOfLeadsToday");
router.get("/leadProcessing/getListOfLeadsToday", getListOfLeadsToday);

//School Recommendation

const { addSchoolToLead } = require("../../controllers/LeadMgmt/SchoolRecommendation/addSchoolToLead");
router.put("/schoolRecommendation/addSchoolToLead", addSchoolToLead);


const { addSchoolRecommendation } = require("../../controllers/LeadMgmt/SchoolRecommendation/addSchoolRecommendation");
router.post("/schoolRecommendation/addSchoolRecommendation", addSchoolRecommendation);

const { getListOfSchoolRecommendation } = require("../../controllers/LeadMgmt/SchoolRecommendation/getListOfSchoolRecommendation");
router.get("/schoolRecommendation/getListOfSchoolRecommendation/:leadId", getListOfSchoolRecommendation);

const { addBaggageTagToSchool } = require("../../controllers/LeadMgmt/SchoolRecommendation/addBaggageTagToSchool");
router.post("/schoolRecommendation/addBaggageTagToSchool", addBaggageTagToSchool);


//Telecalling

const { assignTelecallerToLead } = require("../../controllers/LeadMgmt/Telecalling/assignTelecallerToLead");
router.post("/telecalling/assignTelecallerToLead", assignTelecallerToLead);

const { setNextTelecallingDate } = require("../../controllers/LeadMgmt/Telecalling/setNextTelecallingDate");
router.post("/telecalling/setNextTelecallingDate", setNextTelecallingDate);

const { closeTeleCallFollowUp } = require("../../controllers/LeadMgmt/Telecalling/closeTeleCallFollowUp");
router.post("/telecalling/closeTeleCallFollowUp", closeTeleCallFollowUp);


*/


module.exports = router