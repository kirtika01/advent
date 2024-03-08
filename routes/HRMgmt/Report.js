const router = require('express').Router()
const authMiddleware = require('../../middlewares/authenticateOTPTokens')

const { getAttendanceReportEmployee } = require('../../controllers/HRMgmt/Report/getAttendanceReportEmployee');
const {inOfficeReport} = require('../../controllers/HRMgmt/Report/inOfficeReport');

router.get('/getAttendanceReportEmployee',authMiddleware.authenticateOTPTokens,  getAttendanceReportEmployee);
router.get('/attendance/inOfficeReport',authMiddleware.authenticateOTPTokens,inOfficeReport);

//route for leaveCountByMonth
const { leaveCountByMonth } = require('../../controllers/HRMgmt/Report/Leave/leaveCountByMonth')
router.get('/leave/leaveCountByMonth', authMiddleware.authenticateOTPTokens, leaveCountByMonth)

//route for leaveReportByEmployee
const {leaveReportByEmployee} = require('../../controllers/HRMgmt/Report/Leave/leaveReportByEmployee')
router.get('/leave/leaveReportByEmployee', authMiddleware.authenticateOTPTokens, leaveReportByEmployee);

//route for monthwiseLeaveReport
const { monthwiseLeaveReport } = require('../../controllers/HRMgmt/Report/Leave/monthwiseLeaveReport')
router.get('/leave/monthwiseLeaveReport', authMiddleware.authenticateOTPTokens , monthwiseLeaveReport)

module.exports = router;