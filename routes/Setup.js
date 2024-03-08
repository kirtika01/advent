const router = require("express").Router();


const {getTokenByActivationCode} = require('../controllers/SetUp/getTokenByActivationCode');
router.post('/getTokenByActivationCode' , getTokenByActivationCode);

module.exports = router;