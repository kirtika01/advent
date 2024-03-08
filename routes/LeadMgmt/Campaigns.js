const express = require("express");
const router = express.Router();
const authenticateOTPTokens = require('../../middlewares/authenticateOTPTokens')
const authenticateOTPLead = require('../../middlewares/authenticateOTPLead')


const { createNewLeadWebForm } = require("../../controllers/LeadMgmt/Campaigns/createNewLeadWebForm");
router.post("/createNewLeadWebForm", createNewLeadWebForm);
//Web

const { captureLeadWebsite } = require("../../controllers/LeadMgmt/Campaigns/Web/captureLeadWebsite");
router.post("/web/captureLeadWebsite",authenticateOTPLead.authenticateOTPLead, captureLeadWebsite);

//inbound
const { createNewLeadInBoundCall } = require("../../controllers/LeadMgmt/Campaigns/Inbound/createNewLeadInBoundCall");
router.post("/inbound/createNewLeadInBoundCall", createNewLeadInBoundCall);


module.exports = router
