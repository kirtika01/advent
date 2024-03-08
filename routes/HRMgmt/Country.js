const router = require('express').Router();
const authMiddleware = require('../../middlewares/authenticateOTPTokens');
const upload = require("../../middlewares/Fileupload");


const { createCountry } = require('../../controllers/HRMgmt/Country/createCountry');
router.post('/createCountry', authMiddleware.authenticateOTPTokens, createCountry);

const { assignBranchToCountry } = require('../../controllers/HRMgmt/Country/assignBranchToCountry');
router.put('/assignBranchToCountry', authMiddleware.authenticateOTPTokens, assignBranchToCountry);

const { getListOfCountry } = require('../../controllers/HRMgmt/Country/getListOfCountry');
router.get('/getListOfCountry', authMiddleware.authenticateOTPTokens, getListOfCountry);

const { getCountryByCountryCode } = require('../../controllers/HRMgmt/Country/getCountryByCountryCode');
router.get('/getCountryByCountryCode/:countryCode', authMiddleware.authenticateOTPTokens, getCountryByCountryCode);


module.exports = router;