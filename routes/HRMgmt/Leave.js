const router = require('express').Router()
const authMiddleware = require("../../middlewares/authenticateOTPTokens");
const upload = require('../../middlewares/Fileupload')

const { applyLeave } = require('../../controllers/HRMgmt/Leave/applyLeave')
router.post('/applyLeave', authMiddleware.authenticateOTPTokens, applyLeave);

const { applyHalfDayLeave } = require('../../controllers/HRMgmt/Leave/applyHalfDayLeave')
router.post('/applyHalfDayLeave', authMiddleware.authenticateOTPTokens, applyHalfDayLeave);

const { approveLeave } = require('../../controllers/HRMgmt/Leave/approveLeave')
router.put('/approveLeave', authMiddleware.authenticateOTPTokens, approveLeave);

const { cancelLeave } = require('../../controllers/HRMgmt/Leave/cancelLeave')
router.put('/cancelLeave', authMiddleware.authenticateOTPTokens, cancelLeave);

const { getListOfLeave } = require('../../controllers/HRMgmt/Leave/getListOfLeave')
router.get('/getListOfLeave', authMiddleware.authenticateOTPTokens, getListOfLeave);

const { getLeaveByLeaveId } = require('../../controllers/HRMgmt/Leave/getLeaveByLeaveId')
router.get('/getLeaveByLeaveId/:leaveId', authMiddleware.authenticateOTPTokens, getLeaveByLeaveId);


const { getLeaveBalanceByEmployeeId } = require('../../controllers/HRMgmt/Leave/getLeaveBalanceByEmployeeId')
router.get('/getLeaveBalanceByEmployeeId/:employeeId', authMiddleware.authenticateOTPTokens, getLeaveBalanceByEmployeeId)

//route for uploadSupportingDocument
const { uploadSupportingDocument } = require("../../controllers/HRMgmt/Leave/uploadSupportingDocument");
router.put("/uploadSupportingDocument", upload.single("file"),authMiddleware.authenticateOTPTokens,uploadSupportingDocument);

//route for defineYearlyHolidayList
const {defineYearlyHolidayList} = require('../../controllers/HRMgmt/Leave/defineYearlyHolidayList')
router.post('/defineYearlyHolidayList',authMiddleware.authenticateOTPTokens,defineYearlyHolidayList)

module.exports = router
