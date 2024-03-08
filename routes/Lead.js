const express = require("express");
const router = express.Router();

const {createNewLeadWebForm}= require("../controllers/Lead/createNewLeadWebForm");
const {getListOfLeads}=require("../controllers/Lead/getListOfLeads");
const {getLeadByLeadId}=require("../controllers/Lead/getLeadByLeadId");
const {assignLead} =require("../controllers/Lead/assignLead");
const {updateLeadByLeadId} =require("../controllers/Lead/updateLeadByLeadId");
const {addSchoolToLead} =require("../controllers/Lead/addSchoolToLead");
const {addCommentToLead} =require("../controllers/Lead/addCommentToLead");
const {getListOfLeadCommentByLeadId} =require("../controllers/Lead/getListOfLeadCommentByLeadId");


router.post("/createNewLeadWebForm",createNewLeadWebForm);
router.post("/addCommentToLead",addCommentToLead);
router.patch("/assignLead",assignLead);
router.put("/updateLeadByLeadId",updateLeadByLeadId);
router.put("/addSchoolToLead",addSchoolToLead);
router.get("/getListOfLeads",getListOfLeads);
router.get("/getLeadByLeadId/:leadId",getLeadByLeadId);
router.get("/getListOfLeadCommentByLeadId/:leadId",getListOfLeadCommentByLeadId);


module.exports=router