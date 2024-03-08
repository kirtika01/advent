const router = require('express').Router()
const authMiddleware = require('../../middlewares/authenticateOTPTokens')


const createNewTask = require('../../controllers/HRMgmt/Task/createNewTask')
router.post('/createNewTask', authMiddleware.authenticateOTPTokens,createNewTask.createNewTask)

const { getTaskByTaskId } = require('../../controllers/HRMgmt/Task/getTaskByTaskId')
router.get('/getTaskByTaskId/:taskID', authMiddleware.authenticateOTPTokens, getTaskByTaskId)

const { getListOfTask } = require('../../controllers/HRMgmt/Task/getListOfTask')
router.get('/getListOfTask', authMiddleware.authenticateOTPTokens, getListOfTask)

const { getListOfTasks } = require('../../controllers/HRMgmt/Task/getListOfTasks')
router.get('/getListOfTasks',authMiddleware.authenticateOTPTokens,  getListOfTasks)

const { closeTaskByTaskId } = require('../../controllers/HRMgmt/Task/closeTaskByTaskId')
router.post('/closeTaskByTaskId', authMiddleware.authenticateOTPTokens, closeTaskByTaskId)

const { delegateTaskToAnotherUser } = require('../../controllers/HRMgmt/Task/delegateTaskToAnotherUser')
router.post('/delegateTaskToAnotherUser', authMiddleware.authenticateOTPTokens, delegateTaskToAnotherUser)

const { taskDueToday } = require('../../controllers/HRMgmt/Task/taskDueToday')
router.get('/taskDueToday',authMiddleware.authenticateOTPTokens,  taskDueToday)

const { getListDistinctTaskType } = require('../../controllers/HRMgmt/Task/getListDistinctTaskType');
router.get('/getListDistinctTaskType',authMiddleware.authenticateOTPTokens,  getListDistinctTaskType);

const { taskCountByTasktype } = require('../../controllers/HRMgmt/Task/taskCountByTasktype')
router.get('/taskCountByTasktype', authMiddleware.authenticateOTPTokens, taskCountByTasktype)

const { taskCountByTaskrole } = require('../../controllers/HRMgmt/Task/taskCountByTaskrole')
router.get('/taskCountByTaskrole',authMiddleware.authenticateOTPTokens,  taskCountByTaskrole)

const { taskCountDueVsNoDue } = require('../../controllers/HRMgmt/Task/taskCountDueVsNoDue')
router.get('/taskCountDueVsNoDue',authMiddleware.authenticateOTPTokens,  taskCountDueVsNoDue)

const { taskDashboard } = require('../../controllers/HRMgmt/Task/taskDashboard')
router.get('/taskDashboard',authMiddleware.authenticateOTPTokens,  taskDashboard)

const { listOfTaskAssignedByMe } = require('../../controllers/HRMgmt/Task/listOfTaskAssignedByMe')
router.get('/listOfTaskAssignedByMe',authMiddleware.authenticateOTPTokens,  listOfTaskAssignedByMe)



module.exports = router
