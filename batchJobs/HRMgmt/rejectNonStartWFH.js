var cron = require('node-cron');
const axios = require('axios')
const Attendance = require('../../models/HRMgmt/Attendance');
const { getLogger } = require('../../config/Logger/batchJobLogger');

const logger = getLogger('rejectNonStartWFH.log');


//Prod
//cron.schedule('*/1 * * * *',async () => {
//Test
cron.schedule('20 02 * * *', async () => {

    try {

        console.log('rejectNonStartWFH Job Initiated:::')
        logger.info("rejectNonStartWFH Job Initiated:::" + new Date())

        //test
        //var token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkRpcmVjdG9yIiwiaWF0IjoxNjczNjkwMzgyLCJleHAiOjE3MDQ3OTQzODJ9.Egb2OVWuBrNAD_IQnS1Q1i0-aCbNoiQDUfpKR6bfUmc"
        //Prod
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlN1cmFqIiwiZW1wbG95ZWVJZCI6IkVNUC0yIiwicGxhdGZvcm0iOiJlbXBsb3llZU1vYmlsZSIsImlhdCI6MTcwODUwNzAwMiwiZXhwIjoxNzM5NjExMDAyfQ.UOyDZKkvkRS8HTc-rC77CUNiuVTnHLJf5w--lLNwZNQ"

        let currentDate = new Date();
        console.log(new Date(currentDate - 30 * 60000))
        let checkDate= new Date(currentDate - 30 * 60000)

        let listOfAttendance = await Attendance.aggregate([
            {
                $match: {
                    attendanceType: 'WFH',
                    attendanceStatus: 'WFH Accepted',
                    startTime: { $lte: checkDate }
                }
            },
        ]);
        console.log(listOfAttendance.length)

        if (listOfAttendance.length > 0) {

            await listOfAttendance.reduce(async (promise, att) => {

                await promise;

                let url = process.env.URL + '/api/v1/hrmgmt/Attendance/rejectAttendance';

                let attendanceReject = await axios.put(url, {
                    employeeId: att.employeeId,
                    attendanceId: att.attendanceId,
                    rejectionReason: 'Auto rejected as WFH not initiated on time'
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            platform: 'employeeMobile'
                        }
                })

                if(attendanceReject.status == 200){
                    logger.info(`Auto rejected attendance for employeeId-${att.employeeId} , attendanceId-${att.attendanceId}`)
                }
                else{
                    logger.error(`cannot rejected attendance for employeeId-${att.employeeId} , attendanceId-${att.attendanceId}`)
                }
            
            }, Promise.resolve())
        }

        else {
            logger.info("No attendance found")
        }

        console.log('rejectNonStartWFH Job Terminated:::')
        logger.info("rejectNonStartWFH Job Terminated:::" + new Date())

    } 
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})