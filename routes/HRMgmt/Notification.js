const router = require('express').Router()
const authMiddleware = require('../../middlewares/authenticateOTPTokens')

const {createNotificationEmployee}=require('../../controllers/HRMgmt/Notification/createNotificationEmployee')
router.post('/createNotificationEmployee',authMiddleware.authenticateOTPTokens,createNotificationEmployee);

const {getListOfNotificationEmployee}=require('../../controllers/HRMgmt/Notification/getListOfNotificationEmployee')
router.get('/getListOfNotificationEmployee',authMiddleware.authenticateOTPTokens,getListOfNotificationEmployee);

module.exports=router
