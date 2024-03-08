var cron = require('node-cron');
const Employee = require('../../models/HRMgmt/Employee')
const { getLogger } = require('../../config/Logger/batchJobLogger');
const logger = getLogger('addmonthlyWFHBalance.log');

//Prod
//cron.schedule('*/1 * * * *',async () => {
//Test
cron.schedule('13 23 * * *', async () => {

    try {
        console.log("addmonthlyWFHBalance Job Initiated:::" + new Date())
        logger.info("addmonthlyWFHBalance Job Initiated:::" + new Date())

        //test
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3RVc2VyIiwiaWF0IjoxNzA1MDUwMDc1LCJleHAiOjE5Nzg2NTAwNzV9.sIYL2nmtFDNvTDzj1uh8LkCN6bcb9xJX80Fr_g5q-ys"
        //Prod
        //var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlJhamVuZHJhQyIsImlhdCI6MTY3MzYxNjk4NSwiZXhwIjoxNzA0NzIwOTg1fQ.eWhQrfuFABPevyFiitqpFGNKTe49BnxJPWr3NXgD9XA"

        let activeEmployees = await Employee.find({ isActive: true,canWFH:true })

        let wfhHours = 20;
        let wfhMaxHours = 120;

        if (activeEmployees.length > 0) {
            await activeEmployees.reduce(async (promise, employee) => {
                await promise;

                logger.info("Processing for Employee ::" + employee.employeeFullName + " - " + employee.employeeId)
                
                let currentBalance = employee.wfhBalance

                currentBalance+=wfhHours;
                if(currentBalance>=wfhMaxHours){
                    currentBalance = wfhMaxHours
                }

                employee.wfhBalance = currentBalance
                logger.info(`current Wfh Balance is${employee.wfhBalance} `)
                console.log(employee.wfhBalance)

                let doc = await employee.save()
                if (doc) {
                    logger.info(`wfhBalance updated for Employee-${employee.employeeId}. `)

                }
                else {
                    logger.error(`Unable to update wfhBalance for Employee-${employee.employeeId}`)

                }

            }, Promise.resolve());


        }
        else {
            logger.error("No Employee found")
        }

        logger.info("addmonthlyWFHBalance End :::::" + new Date())

        console.log("addmonthlyWFHBalance Job Completed:::" + new Date())

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})