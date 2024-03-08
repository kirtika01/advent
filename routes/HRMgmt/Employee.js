const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authenticateOTPTokens");
const upload = require('../../middlewares/Fileupload')
const uploadHandler = require('../../middlewares/MultiFileUpload')

// const {createNewEmployee} = require("../../controllers/HRMgmt/Employee/createNewEmployee");
// router.post("/createNewEmployee",authMiddleware.authenticateOTPTokens,createNewEmployee);

const { onboardEmployee } = require("../../controllers/HRMgmt/Employee/onboardEmployee");
router.post("/onboardEmployee", authMiddleware.authenticateOTPTokens, upload.single("file"), onboardEmployee);

const { updateEmployee } = require("../../controllers/HRMgmt/Employee/updateEmployee");
router.put("/updateEmployee", authMiddleware.authenticateOTPTokens,updateEmployee);

const { uploadEmployeeDocuments } = require("../../controllers/HRMgmt/Employee/uploadEmployeeDocuments");
router.put('/uploadEmployeeDocuments', authMiddleware.authenticateOTPTokens, upload.single("file"), uploadEmployeeDocuments);  //pending info

const { getListOfEmployee } = require("../../controllers/HRMgmt/Employee/getListOfEmployee");
router.get('/getListOfEmployee', authMiddleware.authenticateOTPTokens, getListOfEmployee);

const { updateEmployeeRole } = require("../../controllers/HRMgmt/Employee/updateEmployeeRole");
router.put('/updateEmployeeRole', authMiddleware.authenticateOTPTokens, updateEmployeeRole);

const { getEmployeeByEmployeeId } = require("../../controllers/HRMgmt/Employee/getEmployeeByEmployeeId");
router.get('/getEmployeeByEmployeeId/:employeeId', authMiddleware.authenticateOTPTokens, getEmployeeByEmployeeId);

const { toggleEmployeeActive } = require("../../controllers/HRMgmt/Employee/toggleEmployeeActive");
router.put('/toggleEmployeeActive', authMiddleware.authenticateOTPTokens, toggleEmployeeActive);

const { assignLineManager } = require("../../controllers/HRMgmt/Employee/assignLineManager");
router.put('/assignLineManager', authMiddleware.authenticateOTPTokens, assignLineManager);

const { updateSalaryAccount } = require("../../controllers/HRMgmt/Employee/updateSalaryAccount");
router.put('/updateSalaryAccount', authMiddleware.authenticateOTPTokens, updateSalaryAccount);

//route for assignHRManager
const { assignHRManager } = require("../../controllers/HRMgmt/Employee/assignHRManager");
router.put('/assignHRManager', authMiddleware.authenticateOTPTokens, assignHRManager);

const { assignRoleToEmployee } = require("../../controllers/HRMgmt/Employee/assignRoleToEmployee");
router.put('/assignRoleToEmployee', authMiddleware.authenticateOTPTokens, assignRoleToEmployee);

const { generateRegisterCode } = require("../../controllers/HRMgmt/Employee/generateRegisterCode");
router.post('/generateRegisterCode', generateRegisterCode);

const { updateDeviceToken } = require("../../controllers/HRMgmt/Employee/updateDeviceToken");
router.post('/updateDeviceToken', authMiddleware.authenticateOTPTokens,updateDeviceToken);

const { uploadEmployeePhoto } = require('../../controllers/HRMgmt/Employee/uploadEmployeePhoto');
router.put('/uploadEmployeePhoto', upload.single('file'), uploadEmployeePhoto);

//route for uploadGovtId
const { uploadGovtId } = require('../../controllers/HRMgmt/Employee/uploadGovtId');
router.put('/uploadGovtId', upload.single('file'), uploadGovtId);

//route for addEducationalDetails
const { addEducationalDetails } = require('../../controllers/HRMgmt/Employee/addEducationalDetails');
router.put('/addEducationalDetails',
        upload.fields([{ name: 'degreeScan', maxCount: 1 }, { name: 'marksheetScan', maxCount: 1 }]),
        addEducationalDetails);

//route for deleteEducationalDetails
const { deleteEducationalDetails } = require('../../controllers/HRMgmt/Employee/deleteEducationalDetails');
router.put('/deleteEducationalDetails',  deleteEducationalDetails);

//route for addPreviousEmploymentDetails
const { addPreviousEmploymentDetails } = require('../../controllers/HRMgmt/Employee/addPreviousEmploymentDetails');
router.put('/addPreviousEmploymentDetails',
        upload.fields([{ name: 'experienceLetterScan', maxCount: 1 }, { name: 'payslipsScan', maxCount: 1 },{ name: 'additionalDocumentScan', maxCount: 1 }]),
        addPreviousEmploymentDetails);

//route for deletePreviousEmploymentDetails
const { deletePreviousEmploymentDetails } = require('../../controllers/HRMgmt/Employee/deletePreviousEmploymentDetails');
router.put('/deletePreviousEmploymentDetails',  deletePreviousEmploymentDetails);

//validateRegisterCode

const { validateRegisterCode } = require('../../controllers/HRMgmt/Employee/validateRegisterCode');
router.post('/validateRegisterCode', validateRegisterCode);

module.exports = router

