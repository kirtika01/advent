var cron = require('node-cron');
const Attendance = require('../../models/HRMgmt/Attendance');
const { getLogger } = require('../../config/Logger/batchJobLogger');

const logger = getLogger('rejectAttendance.log');


//Prod
//cron.schedule('*/1 * * * *',async () => {
//Test
cron.schedule('03 01 * * *', async () => {

    try {

        console.log('RejectAttendance Job Initiated:::')
        logger.info('RejectAttendance Job Initiated:::'+new Date())

        //test
        //var token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkRpcmVjdG9yIiwiaWF0IjoxNjczNjkwMzgyLCJleHAiOjE3MDQ3OTQzODJ9.Egb2OVWuBrNAD_IQnS1Q1i0-aCbNoiQDUfpKR6bfUmc"
        //Prod
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlN1cmFqIiwiZW1wbG95ZWVJZCI6IkVNUC0yIiwicGxhdGZvcm0iOiJlbXBsb3llZU1vYmlsZSIsImlhdCI6MTcwODUwNzAwMiwiZXhwIjoxNzM5NjExMDAyfQ.UOyDZKkvkRS8HTc-rC77CUNiuVTnHLJf5w--lLNwZNQ"

        var chkDate = new Date();
        chkDate.setDate(chkDate.getDate() + 1);
        
        
        let listOfAttendance = await Attendance.find({
            $or: [
                { attendanceType: 'InOffice' },
                { attendanceType: 'WFH' }
            ],
            attendanceStatus: 'Initiated',
            startTime: { $lte: chkDate }
        });

        console.log(listOfAttendance.length)

        if (listOfAttendance.length > 0) {

            await listOfAttendance.reduce(async (promise, att) => {

                await promise;

                let attendance = await Attendance.findOne({ attendanceId: att.attendanceId });
                attendance.attendanceStatus = 'Rejected';
                attendance.rejectionReason = 'Auto rejected as no scan out is present';

                let doc = await attendance.save();

                if (doc) {
                    //console.log(`Attendance - ${attendance.attendanceId} updated`)
                    logger.info(`Attendance - ${attendance.attendanceId} updated`)
                } else {
                    //console.log(`Could not update Attendnace - ${attendance.attendanceId}`)
                    logger.error(`Could not update Attendnace - ${attendance.attendanceId}`)
                }
            }, Promise.resolve())

        }
        else{
            logger.info("No attendance found")
        }

        console.log('RejectAttendance Job Terminated:::')
        logger.info('RejectAttendance Job Terminated:::'+new Date())

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})