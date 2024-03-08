const router = require('express').Router();
const upload = require("../../middlewares/Fileupload");
const authMiddleware = require("../../middlewares/authenticateOTPTokens");


const {createBranch} = require('../../controllers/HRMgmt/Branch/createBranch');
router.post('/createBranch',authMiddleware.authenticateOTPTokens,  createBranch);

const { getListOfBranch } = require('../../controllers/HRMgmt/Branch/getListOfBranch');
router.get('/getListOfBranch', getListOfBranch);

const {getBranchByCode} = require('../../controllers/HRMgmt/Branch/getBranchByCode');
router.get('/getBranchByCode/:branchCode', getBranchByCode);

const {toggleBranch} = require('../../controllers/HRMgmt/Branch/toggleBranch');
router.put('/toggleBranch',authMiddleware.authenticateOTPTokens,  toggleBranch);


const { assignBranchAdmin } = require('../../controllers/HRMgmt/Branch/assignBranchAdmin');
router.put('/assignBranchAdmin',authMiddleware.authenticateOTPTokens,  assignBranchAdmin);

const { assignHRAdmin } = require('../../controllers/HRMgmt/Branch/assignHRAdmin');
router.put('/assignHRAdmin',authMiddleware.authenticateOTPTokens,  assignHRAdmin);

const { assignFinTeam } = require('../../controllers/HRMgmt/Branch/assignFinTeam');
router.put('/assignFinTeam',authMiddleware.authenticateOTPTokens,  assignFinTeam);

//route for assignBaseBranchToEmployee
const { assignBaseBranchToEmployee } = require('../../controllers/HRMgmt/Branch/assignBaseBranchToEmployee');
router.put('/assignBaseBranchToEmployee',authMiddleware.authenticateOTPTokens,  assignBaseBranchToEmployee);


module.exports = router;