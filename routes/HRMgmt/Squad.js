const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authenticateOTPTokens");
const upload = require('../../middlewares/Fileupload')

//authMiddleware.authenticateOTPTokens,
const { createSquad } = require("../../controllers/HRMgmt/Squad/createSquad");
router.post("/createSquad",  upload.single("file"),authMiddleware.authenticateOTPTokens, createSquad);

//route for assignGeoToSquad
const { assignGeoToSquad } = require("../../controllers/HRMgmt/Squad/assignGeoToSquad");
router.put("/assignGeoToSquad",authMiddleware.authenticateOTPTokens, assignGeoToSquad);

//route for getSquadBySquadCode
const { getSquadBySquadCode } = require("../../controllers/HRMgmt/Squad/getSquadBySquadCode");
router.get("/getSquadBySquadCode/:squadCode",authMiddleware.authenticateOTPTokens, getSquadBySquadCode);

//route for getListOfSquad
const { getListOfSquad } = require("../../controllers/HRMgmt/Squad/getListOfSquad");
router.get("/getListOfSquad",authMiddleware.authenticateOTPTokens, getListOfSquad);

//route for assignEmployeeToSquad
const { assignEmployeeToSquad } = require("../../controllers/HRMgmt/Squad/assignEmployeeToSquad");
router.put("/assignEmployeeToSquad",authMiddleware.authenticateOTPTokens, assignEmployeeToSquad);

//route for removeEmployeeFromSquad
const { removeEmployeeFromSquad } = require("../../controllers/HRMgmt/Squad/removeEmployeeFromSquad");
router.put("/removeEmployeeFromSquad",authMiddleware.authenticateOTPTokens, removeEmployeeFromSquad);

//route for updateSquadByCode
const { updateSquadByCode } = require("../../controllers/HRMgmt/Squad/updateSquadByCode");
router.put("/updateSquadByCode",authMiddleware.authenticateOTPTokens, updateSquadByCode);

//route for uploadSquadLogo
const { uploadSquadLogo } = require("../../controllers/HRMgmt/Squad/uploadSquadLogo");
router.put("/uploadSquadLogo", upload.single("file"),authMiddleware.authenticateOTPTokens, uploadSquadLogo);

//route for assignRelatedSquad
const { assignRelatedSquad } = require("../../controllers/HRMgmt/Squad/assignRelatedSquad");
router.put("/assignRelatedSquad",authMiddleware.authenticateOTPTokens, assignRelatedSquad);

//route for deleteSquadBySquadCode
const { deleteSquadBySquadCode } = require("../../controllers/HRMgmt/Squad/deleteSquadBySquadCode");
router.delete("/deleteSquadBySquadCode",authMiddleware.authenticateOTPTokens, deleteSquadBySquadCode);

module.exports = router
