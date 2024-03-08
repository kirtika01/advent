const router = require('express').Router();
const upload = require("../../middlewares/Fileupload");
const authMiddleware = require("../../middlewares/authenticateOTPTokens");


const { applyNewClaim } = require('../../controllers/HRMgmt/Claims/applyNewClaim');
const { uploadSupportingDocument } = require('../../controllers/HRMgmt/Claims/uploadSupportingDocument');
const { getListOfClaims } = require('../../controllers/HRMgmt/Claims/getListOfClaims');
const { getClaimByClaimId } = require('../../controllers/HRMgmt/Claims/getClaimByClaimId');
const { getClaimTimelineByClaimId } = require('../../controllers/HRMgmt/Claims/getClaimTimelineByClaimId');
const { claimApprovalByFinance } = require('../../controllers/HRMgmt/Claims/claimApprovalByFinance');
const { claimApprovalByLineManager } = require('../../controllers/HRMgmt/Claims/claimApprovalByLineManager');

const { getNumberOfClaimsByClaimType } = require('../../controllers/HRMgmt/Claims/getNumberOfClaimsByClaimType');
const { getSumOfClaimsByClaimType } = require('../../controllers/HRMgmt/Claims/getSumOfClaimsByClaimType');
const { getClaimsByStatus } = require('../../controllers/HRMgmt/Claims/getClaimsByStatus');
const { getNumberOfClaimsByEmployee } = require('../../controllers/HRMgmt/Claims/getNumberOfClaimsByEmployee');
const { getSumOfClaimsByEmployee } = require('../../controllers/HRMgmt/Claims/getSumOfClaimsByEmployee');
const { getClaimsOfLastTwelveMonths } = require('../../controllers/HRMgmt/Claims/getClaimsOfLastTwelveMonths');
const { getListOfOpenClaims } = require('../../controllers/HRMgmt/Claims/getListOfOpenClaims');
const { getListOfClosedClaims } = require('../../controllers/HRMgmt/Claims/getListOfClosedClaims');
const { listOfClaimsFinanceApproval } = require('../../controllers/HRMgmt/Claims/listOfClaimsFinanceApproval')
const { claimsCountMonth } = require('../../controllers/HRMgmt/Claims/claimsCountMonth');

router.post('/applyNewClaim', authMiddleware.authenticateOTPTokens, applyNewClaim);
router.put('/uploadSupportingDocument',  upload.single("file"), uploadSupportingDocument);
router.get('/getListOfClaims', authMiddleware.authenticateOTPTokens, getListOfClaims);
router.get('/getClaimByClaimId/:claimId', authMiddleware.authenticateOTPTokens, getClaimByClaimId);
router.get('/getClaimTimelineByClaimId/:claimId', authMiddleware.authenticateOTPTokens, getClaimTimelineByClaimId);
router.get('/claimsCountMonth/:raisedByEmpId',authMiddleware.authenticateOTPTokens,  claimsCountMonth)

router.get('/getNumberOfClaimsByClaimType',authMiddleware.authenticateOTPTokens,  getNumberOfClaimsByClaimType);
router.get('/getSumOfClaimsByClaimType', authMiddleware.authenticateOTPTokens, getSumOfClaimsByClaimType);
router.get('/getClaimsByStatus',authMiddleware.authenticateOTPTokens,  getClaimsByStatus);
router.get('/getNumberOfClaimsByEmployee', authMiddleware.authenticateOTPTokens, getNumberOfClaimsByEmployee);
router.get('/getSumOfClaimsByEmployee',authMiddleware.authenticateOTPTokens,  getSumOfClaimsByEmployee);
router.get('/getClaimsOfLastTwelveMonths', authMiddleware.authenticateOTPTokens, getClaimsOfLastTwelveMonths);
router.get('/getListOfOpenClaims/:employeeId',authMiddleware.authenticateOTPTokens,  getListOfOpenClaims);
router.get('/getListOfClosedClaims/:employeeId',authMiddleware.authenticateOTPTokens,  getListOfClosedClaims);
router.get('/listOfClaimsFinanceApproval',authMiddleware.authenticateOTPTokens,  listOfClaimsFinanceApproval);
// router.put('/claimApprovalByFinance',  claimApprovalByFinance);
// router.put('/claimApprovalByLineManager',  claimApprovalByLineManager)

module.exports = router;
