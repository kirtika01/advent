var cron = require('node-cron');
const LeavePlan = require('../../models/HRMgmt/LeavePlan')
const Employee = require('../../models/HRMgmt/Employee')
const Logger = require('../../config/Logger/batchJobLogger')
const { getLogger } = require('../../config/Logger/batchJobLogger');
const logger = getLogger('clearLeaveBalance.log');

//Prod
//cron.schedule('*/1 * * * *',async () => {
//Test
cron.schedule('59 18 * * *', async () => {

    try {
        console.log("clearLeaveBalance Job Initiated:::" + new Date())
        logger.info("clearLeaveBalance Job Initiated:::" + new Date())

        //test
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3RVc2VyIiwiaWF0IjoxNzA1MDUwMDc1LCJleHAiOjE5Nzg2NTAwNzV9.sIYL2nmtFDNvTDzj1uh8LkCN6bcb9xJX80Fr_g5q-ys"
        //Prod
        //var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlJhamVuZHJhQyIsImlhdCI6MTY3MzYxNjk4NSwiZXhwIjoxNzA0NzIwOTg1fQ.eWhQrfuFABPevyFiitqpFGNKTe49BnxJPWr3NXgD9XA"

        let activeEmployees = await Employee.find({ isActive: true, leavePlanId: { $ne: "Not Assigned" } })


        if (activeEmployees.length > 0) {
            await activeEmployees.reduce(async (promise, employee) => {
                await promise;

                logger.info("Processing for Employee ::" + employee.employeeFullName + " - " + employee.employeeId)

                await employee.leaveBalance.reduce(async (promise, leaveblnc) => {
                    await promise;

                    logger.info("Processing for leaveCode-  " + leaveblnc.leaveCode)

                    if (leaveblnc.isCarryForward == true || leaveblnc.isCarryForward == "true") {
                        logger.info("carried Forward for leaveCode-  "+leaveblnc.leaveCode)
                    }
                    else {
                        leaveblnc.balance = 0;
                    }

                }, Promise.resolve());

                let doc = await employee.save();

                if (doc) {
                    logger.info(`Leave Balances updated for Employee: ${employee.employeeId}`);
                }
                else {
                    logger.error(`Error updating Leave Balances for Employee: ${employee.employeeId}`);
                }


            }, Promise.resolve());


        }
        else {
            logger.error("No Employee found")
        }

        logger.info("clearLeaveBalance End :::::" + new Date())
        console.log("clearLeaveBalance Job End:::" + new Date())


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})