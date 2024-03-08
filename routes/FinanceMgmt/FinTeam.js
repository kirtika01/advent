const router = require('express').Router();
const authMiddleware = require('../../middlewares/authenticateOTPTokens');
const upload = require("../../middlewares/Fileupload");


const { createFinTeam } = require('../../controllers/FinanceMgmt/FinTeam/createFinTeam');
router.post('/createFinTeam', authMiddleware.authenticateOTPTokens, createFinTeam);

const { getFinTeamByCountryCode } = require('../../controllers/FinanceMgmt/FinTeam/getFinTeamByCountryCode');
router.get('/getFinTeamByCountryCode/:countryCode', authMiddleware.authenticateOTPTokens, getFinTeamByCountryCode);


module.exports = router;