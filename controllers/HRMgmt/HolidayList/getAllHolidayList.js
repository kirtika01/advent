const fs = require('fs');
const path = require('path');

exports.getAllHolidayList = async (req, res) => {
    try {

        const folderPath = path.join('config/Json/holidayList');
        const files = fs.readdirSync(folderPath);

        let holidayLists =[];

        await files.reduce(async (promise, file) => {
            await promise;
            const filePath = path.join(folderPath, file);
            const fileData = fs.readFileSync(filePath, 'utf8');
            const holidaysData = JSON.parse(fileData);
            console.log(holidaysData)
            if(req.query.year && req.query.status){
                if(holidaysData.year == req.query.year && holidaysData.status == req.query.status){
                    holidayLists.push({
                        year:holidaysData.year,
                        state:holidaysData.state,
                        status:holidaysData.status
                    });
                }
            }
            else if(req.query.year){
                if(holidaysData.year == req.query.year){
                    holidayLists.push({
                        year:holidaysData.year,
                        state:holidaysData.state,
                        status:holidaysData.status
                    });
                }
            }
            else if(req.query.status){
                if(holidaysData.status == req.query.status){
                    holidayLists.push({
                        year:holidaysData.year,
                        state:holidaysData.state,
                        status:holidaysData.status
                    });
                }
            }
            else{
                holidayLists.push({
                    year:holidaysData.year,
                    state:holidaysData.state,
                    status:holidaysData.status
                });
            }

            
        }, Promise.resolve()); 

        if(holidayLists.length === 0){
            return res.status(200).json({ 
                status: false,
                count: 0,
                message: 'No Holiday List found'
            });
        }
        return res.status(200).json({ 
            status: true,
            count: holidayLists.length,
            holidayLists: holidayLists
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