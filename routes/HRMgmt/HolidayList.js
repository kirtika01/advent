const router = require('express').Router();
const upload = require("../../middlewares/Fileupload");
const authMiddleware = require("../../middlewares/authenticateOTPTokens");

//route for defineYearlyHolidayList
const { defineYearlyHolidayList } = require('../../controllers/HRMgmt/HolidayList/defineYearlyHolidayList');
router.post('/defineYearlyHolidayList',authMiddleware.authenticateOTPTokens, defineYearlyHolidayList);

//route for getHolidayList
const { getHolidayList } = require('../../controllers/HRMgmt/HolidayList/getHolidayList');
router.get('/getHolidayList',authMiddleware.authenticateOTPTokens, getHolidayList);

//route for approveYearlyHolidayList
const { approveYearlyHolidayList } = require('../../controllers/HRMgmt/HolidayList/approveYearlyHolidayList');
router.put('/approveYearlyHolidayList',authMiddleware.authenticateOTPTokens, approveYearlyHolidayList);

//route for getAllHolidayList
const { getAllHolidayList } = require('../../controllers/HRMgmt/HolidayList/getAllHolidayList');
router.get('/getAllHolidayList',authMiddleware.authenticateOTPTokens, getAllHolidayList);



module.exports = router;