const router = require('express').Router()
const authMiddleware = require('../../middlewares/authenticateOTPTokens')

const { createLeavePlan } = require('../../controllers/HRMgmt/LeavePlan/createLeavePlan')
router.post('/createLeavePlan', authMiddleware.authenticateOTPTokens, createLeavePlan);

const { getLeavePlanByLeavePlanId } = require('../../controllers/HRMgmt/LeavePlan/getLeavePlanByLeavePlanId')
router.get('/getLeavePlanByLeavePlanId/:leavePlanId', authMiddleware.authenticateOTPTokens, getLeavePlanByLeavePlanId);

const { getListOfLeavePlan } = require('../../controllers/HRMgmt/LeavePlan/getListOfLeavePlan')
router.get('/getListOfLeavePlan', authMiddleware.authenticateOTPTokens, getListOfLeavePlan);

const { updateLeavePlan } = require("../../controllers/HRMgmt/LeavePlan/updateLeavePlan");
router.put('/updateLeavePlan', authMiddleware.authenticateOTPTokens, updateLeavePlan)

const { assignLeavePlanToEmployee } = require('../../controllers/HRMgmt/LeavePlan/assignLeavePlanToEmployee');
router.put('/assignLeavePlanToEmployee', authMiddleware.authenticateOTPTokens, assignLeavePlanToEmployee)

const { getLeaveBalanceList } = require('../../controllers/HRMgmt/LeavePlan/getLeaveBalanceList');
router.get('/getLeaveBalanceList', authMiddleware.authenticateOTPTokens, getLeaveBalanceList)

const {toggleActiveLeavePlan} = require('../../controllers/HRMgmt/LeavePlan/toggleActiveLeavePlan')
router.put('/toggleActiveLeavePlan/:leavePlanId', authMiddleware.authenticateOTPTokens, toggleActiveLeavePlan)

module.exports = router
