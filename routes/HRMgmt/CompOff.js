const router = require('express').Router();
const authMiddleware = require('../../middlewares/authenticateOTPTokens');
const upload = require("../../middlewares/Fileupload");

const { applyCompOff } = require('../../controllers/HRMgmt/CompOff/applyCompOff');
router.post('/applyCompOff', authMiddleware.authenticateOTPTokens, applyCompOff);

const { approveCompOff } = require('../../controllers/HRMgmt/CompOff/approveCompOff');
router.put('/approveCompOff', authMiddleware.authenticateOTPTokens, approveCompOff);

const { getListOfCompOff } = require('../../controllers/HRMgmt/CompOff/getListOfCompOff');
router.get('/getListOfCompOff', authMiddleware.authenticateOTPTokens, getListOfCompOff);

const { getCompOffByCompOffId } = require('../../controllers/HRMgmt/CompOff/getCompOffByCompOffId');
router.get('/getCompOffByCompOffId/:compOffId', authMiddleware.authenticateOTPTokens, getCompOffByCompOffId);



module.exports = router;