var cron = require('node-cron');
const axios = require('axios');
const LeavePlan = require('../../models/HRMgmt/LeavePlan')
const Employee = require('../../models/HRMgmt/Employee')
const Logger = require('../../config/Logger/batchJobLogger')
const { getLogger } = require('../../config/Logger/batchJobLogger');
const logger = getLogger('MonthlyLeaveBalance.log');

//Prod
//cron.schedule('*/1 * * * *',async () => {
//Test
cron.schedule('07 20 * * *', async () => {
    console.log("MonthlyLeaveBalance Job Initiated:::" + new Date())
    //let logger = await Logger('MonthlyLeaveBalance.log')
    try {
        //console.log("MonthlyLeaveBalance Job Initiated:::" + new Date())
        logger.info("MonthlyLeaveBalance Job Initiated:::" + new Date())

        //test
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlN1cmFqIiwiZW1wbG95ZWVJZCI6IkVNUC0yIiwicGxhdGZvcm0iOiJlbXBsb3llZU1vYmlsZSIsImlhdCI6MTcwODQyNzE2MCwiZXhwIjoxNzM5NTMxMTYwfQ.M48o7l9olCqHwUOFzK4s5Ur_T73c5pIcOyP-9oRYdoM"
        //Prod
        //var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlJhamVuZHJhQyIsImlhdCI6MTY3MzYxNjk4NSwiZXhwIjoxNzA0NzIwOTg1fQ.eWhQrfuFABPevyFiitqpFGNKTe49BnxJPWr3NXgD9XA"

        let activeEmployees = await Employee.find({ isActive: true, leavePlanId: { $ne: "Not Assigned" } })

        let currentMonth = new Date().getMonth() + 1

        if (activeEmployees.length > 0) {
            await activeEmployees.reduce(async (promise, employee) => {
                await promise;

                logger.info("Processing for Employee ::" + employee.employeeFullName + " - " + employee.employeeId)
                logger.info("employee.leavePlanId is :::::" + employee.leavePlanId)

                let leavePlan = await LeavePlan.findOne({ leavePlanId: employee.leavePlanId })

                if (!leavePlan) {
                    logger.error(`leave plan with id - ${employee.leavePlanId} for employee with employeeId - ${employee.employeeId}`)
                }

                await leavePlan.leaveCredits.reduce(async (promise, leaveCredit) => {

                    await promise;
                    const leaveCode = leaveCredit.leaveCode;

                    //Check if Leave is Type Monthly
                    if (leaveCredit.frequency == "Monthly") {
                        // Check if leave code is not in employee.leaveBalance
                        let leaveTypeFound = false

                        for (let i = 0; i < employee.leaveBalance.length; i++) {
                            if (employee.leaveBalance[i].leaveType === leaveCredit.leaveType) {
                                leaveTypeFound = true
                                // Copy the object into employee.leaveBalance
                                employee.leaveBalance[i].balance = parseInt(employee.leaveBalance[i].balance) + parseInt(leaveCredit.balance)
                                if (parseInt(employee.leaveBalance[i].balance) > parseInt(leaveCredit.maxLimit)) {
                                    employee.leaveBalance[i].balance = parseInt(leaveCredit.maxLimit)
                                }

                                // employee.leaveBalance[i].balance = employee.leaveBalance[i].balance + leaveCredit.balance
                                // if (employee.leaveBalance[i].balance > leaveCredit.maxLimit) {
                                //     employee.leaveBalance[i].balance = leaveCredit.maxLimit
                                // }
                            }
                        }
                        if (leaveTypeFound === false) {
                            employee.leaveBalance.push({
                                leaveCode: leaveCredit.leaveCode,
                                leaveType: leaveCredit.leaveType,
                                balance: leaveCredit.balance,
                                maxLimit: leaveCredit.maxLimit,
                                isCarryForward: leaveCredit.isCarryForward,
                                isSpecialLeave: leaveCredit.isSpecialLeave,
                                frequency: leaveCredit.frequency,
                                isMedicalLeave: leaveCredit.isMedicalLeave,
                                comments: leaveCredit.comments
                            })
                        }
                    }
                    else(
                        logger.info(`Leave Credit with leaveCode - ${leaveCredit.leaveCode}  is not Monthly`)
                    )
                    
                }, Promise.resolve());

                let doc = await employee.save()
                if (doc) {
                    console.log("Employee Leave Balance updated for Employee-" + employee.employeeId)   
                    console.log("Send Notification to Employee-" + employee.employeeId)
                    // url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
                    // let sendNotify = await axios.post(url, {
                    //     "notificationAudience": "Personal",
                    //     "notificationHeadline": `Leave Balance Updated -${currentMonth}`,
                    //     "notificationBody": `Leave Balance Updated -${currentMonth}. Check Leave balance section of your mobile app for more details.`,
                    //     "isPriority": false,
                    //     "employeeId": employee.employeeId
                    // }, {
                    //     headers: {
                    //         'Authorization': `Bearer ${token}`,
                    //         'Platform': `employeeMobile`
                    //     }
                    // })

                    // if (sendNotify.status !== 200) {
                    //     logger.error(`Unable to send notification for Employee-${employee.employeeId}`)
                    // }
                    // logger.info(`Notification sent to Employee-${employee.employeeId}`)
                    // logger.info(`Employee Leave Balance updated for Employee-${employee.employeeId}. `)

                }
                else {
                    logger.error(`Unable to update Leave Balance for Employee-${employee.employeeId}`)

                }

            }, Promise.resolve());


        }
        else {
            logger.error("No Employee found")
        }

        logger.info("MonthlyLeaveBalance End :::::" + new Date())

        console.log("MonthlyLeaveBalance Job Completed:::" + new Date())

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})