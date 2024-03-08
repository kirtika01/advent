var cron = require('node-cron');
const Notification = require('../../models/HRMgmt/Notification')
const { getLogger } = require('../../config/Logger/batchJobLogger');
const logger = getLogger('cleanupNotification.log');

//Prod
//cron.schedule('*/1 * * * *',async () => {
//Test
cron.schedule('15 17 * * *', async () => {

    try {
        logger.info("cleanupNotification Job Initiated:::" + new Date())
        console.log("cleanupNotification Job Initiated:::" + new Date())

        //test
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3RVc2VyIiwiaWF0IjoxNzA1MDUwMDc1LCJleHAiOjE5Nzg2NTAwNzV9.sIYL2nmtFDNvTDzj1uh8LkCN6bcb9xJX80Fr_g5q-ys"
        //Prod
        //var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlJhamVuZHJhQyIsImlhdCI6MTY3MzYxNjk4NSwiZXhwIjoxNzA0NzIwOTg1fQ.eWhQrfuFABPevyFiitqpFGNKTe49BnxJPWr3NXgD9XA"

        let maxDays = process.env.MAXDAYS_FOR_NOTIFICATION

        //write code for deleting the notification older than maxDays
        let date = new Date()
        date.setDate(date.getDate() - maxDays)
        date.setUTCHours(0, 0, 0, 0)

        let notifications = await Notification.find({ "createdAt": { $lte: date } })

        if (notifications.length > 0) {
            await notifications.reduce(async (promise, notification) => {
                await promise;

                logger.info("Processing for Notification ::" + notification.notificationId)

                let doc = await Notification.findOneAndDelete({ notificationId: notification.notificationId })
                if (doc) {
                    logger.info(`Notification deleted for Notification-${notification.notificationId}. `)

                }
                else {
                    logger.error(`Unable to delete Notification-${notification.notificationId}`)

                }

            }, Promise.resolve());
        }
        else {
            logger.info("No Notifications greater than " + maxDays + " days found.")
        }
        logger.info("cleanupNotification Job Completed:::" + new Date())
        console.log("cleanupNotification Job Completed:::" + new Date())
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})