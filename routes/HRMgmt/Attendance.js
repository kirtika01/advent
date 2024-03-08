const router = require("express").Router()
const authMiddleware = require("../../middlewares/authenticateOTPTokens");


const { addAttendanceRecordFieldWork } = require('../../controllers/HRMgmt/Attendance/addAttendanceRecordFieldWork');

const { addAttendanceRecord } = require('../../controllers/HRMgmt/Attendance/addAttendanceRecord');
const { addAttendanceRecordWFH } = require('../../controllers/HRMgmt/Attendance/addAttendanceRecordWFH');
const { getListOfAttendanceRecord } = require('../../controllers/HRMgmt/Attendance/getListOfAttendanceRecord');
const { attendanceApproval } = require('../../controllers/HRMgmt/Attendance/attendanceApproval');
const { updateAttendanceRecord } = require('../../controllers/HRMgmt/Attendance/updateAttendanceRecord');
const { viewAttendanceReport } = require('../../controllers/HRMgmt/Attendance/viewAttendanceReport')
const { addLeaveAttendance } = require('../../controllers/HRMgmt/Attendance/addLeaveAttendance')

router.post('/addAttendanceRecordFieldWork',  authMiddleware.authenticateOTPTokens, addAttendanceRecordFieldWork);
router.post('/addAttendanceRecord', authMiddleware.authenticateOTPTokens,  addAttendanceRecord);
router.post('/addLeaveAttendance',authMiddleware.authenticateOTPTokens,   addLeaveAttendance);
router.post('/addAttendanceRecordWFH', authMiddleware.authenticateOTPTokens,  addAttendanceRecordWFH)
router.put('/attendanceApproval',authMiddleware.authenticateOTPTokens,   attendanceApproval)

router.get('/getListOfAttendanceRecord', authMiddleware.authenticateOTPTokens,  getListOfAttendanceRecord);
router.patch('/updateAttendanceRecord', authMiddleware.authenticateOTPTokens,  updateAttendanceRecord);
router.get('/viewAttendanceReport',authMiddleware.authenticateOTPTokens, viewAttendanceReport);

const { findScanInAttendance } = require('../../controllers/HRMgmt/Attendance/findScanInAttendance')
router.get('/findScanInAttendance/:employeeId',authMiddleware.authenticateOTPTokens,   findScanInAttendance);

const { listOfAttendanceForApproval } = require('../../controllers/HRMgmt/Attendance/listOfAttendanceForApproval')
router.get('/listOfAttendanceForApproval', authMiddleware.authenticateOTPTokens,  listOfAttendanceForApproval);

const { initiateVisit } = require('../../controllers/HRMgmt/Attendance/initiateVisit')
router.post('/initiateVisit', authMiddleware.authenticateOTPTokens,  initiateVisit);

const { completeVisit } = require('../../controllers/HRMgmt/Attendance/completeVisit')
router.post('/completeVisit', authMiddleware.authenticateOTPTokens,  completeVisit);

const { getAttendanceByAttendanceId } = require('../../controllers/HRMgmt/Attendance/getAttendanceByAttendanceId')
router.get('/getAttendanceByAttendanceId/:attendanceId', authMiddleware.authenticateOTPTokens,  getAttendanceByAttendanceId);

const { selfRejectAttendance } = require('../../controllers/HRMgmt/Attendance/selfRejectAttendance')
router.post('/selfRejectAttendance', authMiddleware.authenticateOTPTokens,  selfRejectAttendance);

//route for reportFakeLocation
const {reportFakeLocation} = require("../../controllers/HRMgmt/Attendance/reportFakeLocation");
router.post("/reportFakeLocation" ,authMiddleware.authenticateOTPTokens, reportFakeLocation)

//route for getLastScan
const {getLastScan} = require("../../controllers/HRMgmt/Attendance/getLastScan");
router.get("/getLastScan/:employeeId" ,authMiddleware.authenticateOTPTokens, getLastScan)

//route for initiateWFH
const {initiateWFH} = require("../../controllers/HRMgmt/Attendance/initiateWFH");
router.put("/initiateWFH" ,authMiddleware.authenticateOTPTokens, initiateWFH)

//route for acceptWFH
const {acceptWFH} = require("../../controllers/HRMgmt/Attendance/acceptWFH");
router.put("/acceptWFH" ,authMiddleware.authenticateOTPTokens, acceptWFH)

//route for completeWFH
const {completeWFH} = require("../../controllers/HRMgmt/Attendance/completeWFH");
router.put("/completeWFH" ,authMiddleware.authenticateOTPTokens, completeWFH)

//route for rejectAttendance
const {rejectAttendance} = require("../../controllers/HRMgmt/Attendance/rejectAttendance");
router.put("/rejectAttendance" ,authMiddleware.authenticateOTPTokens, rejectAttendance)

//getListOfActiveWFH
const {getListOfActiveWFH} = require("../../controllers/HRMgmt/Attendance/getListOfActiveWFH");
router.get("/getListOfActiveWFH/:employeeId" ,authMiddleware.authenticateOTPTokens, getListOfActiveWFH)

//route for getListOfActiveVisits
const {getListOfActiveVisits} = require("../../controllers/HRMgmt/Attendance/getListOfActiveVisits");
router.get("/getListOfActiveVisits/:employeeId" ,authMiddleware.authenticateOTPTokens, getListOfActiveVisits)


module.exports = router;