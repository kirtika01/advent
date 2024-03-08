const router = require('express').Router()
const authMiddleware = require('../../middlewares/authenticateOTPTokens')

const { createNewSalaryStructure } = require('../../controllers/HRMgmt/SalaryStructure/createNewSalaryStructure');
router.post('/createNewSalaryStructure', authMiddleware.authenticateOTPTokens, createNewSalaryStructure)

const { getSalaryStructureByEmployeeId } = require('../../controllers/HRMgmt/SalaryStructure/getSalaryStructureByEmployeeId');
router.get('/getSalaryStructureByEmployeeId', authMiddleware.authenticateOTPTokens, getSalaryStructureByEmployeeId)

const { generateCTCDoc } = require('../../controllers/HRMgmt/SalaryStructure/generateCTCDoc');
router.post('/generateCTCDoc',authMiddleware.authenticateOTPTokens,generateCTCDoc)

//route for getListOfSalaryStructure
const { getListOfSalaryStructure } = require('../../controllers/HRMgmt/SalaryStructure/getListOfSalaryStructure');
router.get('/getListOfSalaryStructure', authMiddleware.authenticateOTPTokens, getListOfSalaryStructure)

//route for deleteSalaryStructureById
const { deleteSalaryStructureById } = require('../../controllers/HRMgmt/SalaryStructure/deleteSalaryStructureById');
router.delete('/deleteSalaryStructureById/:salaryStructureId', authMiddleware.authenticateOTPTokens, deleteSalaryStructureById)

//route for checkCTCAvailabity
const { checkCTCAvailabity } = require('../../controllers/HRMgmt/SalaryStructure/checkCTCAvailabity');
router.get('/checkCTCAvailabity', authMiddleware.authenticateOTPTokens, checkCTCAvailabity)

module.exports = router
