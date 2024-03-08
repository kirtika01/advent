const cron = require('node-cron');
const Lead = require('../../models/Lead')
const axios = require('axios')


cron.schedule(' */2 * * * *', async () => {

    var token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFkbWluIiwiZW1wbG95ZWVJZCI6IkVtcC0zOCIsInBsYXRmb3JtIjoiZW1wbG95ZWVNb2JpbGUiLCJpYXQiOjE2ODY4MDk1NTcsImV4cCI6MTcxNzkxMzU1N30.zYLkhdDIzjH3MsEriAZntvUAqBLfWs8uEKLmrAFARL4"

    //Start of assignLeadToQueue
    console.log("assignLeadToQueue Batch Job Initiated::: " + new Date().toLocaleString())

    let listOfLead = await Lead.find({ queueName:"NotAssigned" })


    await listOfLead.reduce(async (promise, lead) => {

        console.log(lead.queueName)

        if(lead.purpose==="Training"){
            lead.queueName="Training"
        }

        else if(lead.preferredCountry==="United States"||lead.preferredCountry==="Canada"){
            lead.queueName="NorthAmerica"
        }
        else if(lead.preferredCountry==="United Kingdom"){
            lead.queueName="UK"
        }
        else if(lead.preferredCountry==="Australia"||lead.preferredCountry==="New Zealand"){
            lead.queueName="ANZ"
        }
        else if(lead.preferredCountry==="Singapore"||lead.preferredCountry==="Malaysia"||lead.preferredCountry==="Thailand"){
            lead.queueName="ASEAN"
        }
        else if(lead.preferredCountry==="Germany"||lead.preferredCountry==="France"||lead.preferredCountry==="Italy"||lead.preferredCountry==="Spain"||lead.preferredCountry==="Netherlands"||lead.preferredCountry==="Sweden"||lead.preferredCountry==="Switzerland"||lead.preferredCountry==="Belgium"||lead.preferredCountry==="Austria"||lead.preferredCountry==="Denmark"||lead.preferredCountry==="Norway"||lead.preferredCountry==="Finland"||lead.preferredCountry==="Ireland"){
            lead.queueName="Europe"
        }
        else if(lead.preferredCountry==="India"){
            lead.queueName="Domestic"
        }
        
        else{
            lead.queueName="Other"
        }


        await lead.save()
        
        // send notification

        let title = ""
        let body = ""

        if(lead.purpose==="Training"){
            title = "New Lead has arrived. Type : "+lead.purpose
            body = `New Lead has arrived and assigned to Training Queue..`
        }
        else{
            title = "New Lead has arrived. Type : "+lead.purpose + " Country : "+lead.preferredCountry
            body = `New Lead has arrived and assigned to ${lead.queueName} Queue..`
        }
    
    
        url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
        let sendNotify = await axios.post(url, {
            "notificationAudience": "Department",
            "notificationHeadline": title,
            "notificationBody": body,
            "notificationPriority": "High",
            "department":"Counsellor"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'platform':'employeeMobile'
            }
        })

        if (sendNotify.status!== 200) {

            console.log("Unable to send notification.Contact Admininistrator")


        }

        
    }, Promise.resolve())

    console.log("assignLeadToQueue Batch Job Completed::: " + new Date().toLocaleString())  
    //End of assignLeadToQueue

})