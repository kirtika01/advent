const fs = require('fs');
        const path = require('path');

exports.getHolidayList = async (req, res) => {
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
                if(req.query.isApproved){
                    if(holidaysData.status === "Approved" && req.query.isApproved === "true"){
                        holidayList = holidaysData;
                    }
                    else if(holidaysData.status === "Draft" && req.query.isApproved === "false"){
                        holidayList = holidaysData;
                    }
                }
                else{
                    holidayList = holidaysData;
                }
            }
        }, Promise.resolve());

        if(Object.keys(holidayList).length === 0){
            throw new Error("Holiday List not found");
        }
        return res.status(200).json({ 
            status: true,
            message: 'HolidayList found successfully' ,
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