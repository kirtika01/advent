const cron = require('node-cron');
const Lead = require('../../models/Lead')
const Employee = require('../../models/HRMgmt/Employee')

const axios = require('axios')


cron.schedule(' */2 * * * *', async () => {

    var token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFkbWluIiwiZW1wbG95ZWVJZCI6IkVtcC0zOCIsInBsYXRmb3JtIjoiZW1wbG95ZWVNb2JpbGUiLCJpYXQiOjE2ODY4MDk1NTcsImV4cCI6MTcxNzkxMzU1N30.zYLkhdDIzjH3MsEriAZntvUAqBLfWs8uEKLmrAFARL4"

    //Start of sendTeleCallingReminder
    console.log("sendTeleCallingReminder Batch Job Initiated::: " + new Date().toLocaleString())


    let listOfLead = await Lead.find({ leadStatus:"CallingInProgress" })

    await listOfLead.reduce(async (promise, lead) => {

        var start = new Date();
        start.setHours(0,0,0,0);
        
        var end = new Date();
        end.setHours(23,59,59,999);

        let employee = await Employee.findOne({ employeeId: lead.telecallerEmpId,nextTelecallingDate:{$gte: start, $lt: end} })

        // send notification
        
        let title = "Please follow up on the lead."+ lead.leadId
        let body = "Lead assigned to you for calling."+ lead.leadId
            
        
    
        url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
        let sendNotify = await axios.post(url, {
            "notificationAudience": "TeamMember",
            "notificationHeadline": title,
            "notificationBody": body,
            "employeeId": employee.employeeId
        }, {
            headers: {
                'Authorization': `${req.headers.authorization}`,
                'Platform':`employeeMobile`
            }
        })

        if (sendNotify.status!== 200) {

            console.log("Unable to send notification.Contact Admininistrator")


        }
    }, Promise.resolve())

    console.log("sendTeleCallingReminder Batch Job Completed::: " + new Date().toLocaleString())  
    //End of sendTeleCallingReminder

})