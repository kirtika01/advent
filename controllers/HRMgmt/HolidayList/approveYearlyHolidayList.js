const fs = require('fs');
const path = require('path');
const axios = require('axios');

exports.approveYearlyHolidayList = async (req, res) => {
    try {

        const folderPath = path.join('config/Json/holidayList');
        const files = fs.readdirSync(folderPath);

        let holidayList ={}

        let state = req.query.state.split(" ").join("_");

        await files.reduce(async (promise, file) => {
            await promise;
            const filePath = path.join(folderPath, file);
            const fileData = fs.readFileSync(filePath, 'utf8');
            const holidaysData = JSON.parse(fileData);
            console.log(holidaysData)
            if(holidaysData.year === parseInt(req.query.year) &&holidaysData.state === state){
                if(holidaysData.status === "Approved"){
                    throw new Error("Holiday List is already approved");
                }
                holidaysData.status = "Approved";
                fs.writeFileSync(filePath, JSON.stringify(holidaysData));
                holidayList = holidaysData;
            }
        }, Promise.resolve()); 

        if(Object.keys(holidayList).length === 0){
            throw new Error("Holiday List not found");
        }
        let year = new Date().getFullYear()
        console.log("year:::" + year)

        url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
        let sendNotify = await axios.post(url, {
            "notificationAudience": "Organisation",
            "notificationHeadline": `Holiday List released -${year}`,
            "notificationBody": `Holiday List released -${year}. Check Leave section of your mobile app for more details.`,
            "isPriority": false
        }, {
            headers: {
                'Authorization': req.headers.authorization,
                'Platform': `employeeMobile`
            }
        })

        if (sendNotify.status !== 200) {
            logger.error(`Unable to send notifications`)
        }
        return res.status(200).json({ 
            status: true,
            message: 'HolidayList approved successfully' ,
            holidayList: holidayList
        });

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}