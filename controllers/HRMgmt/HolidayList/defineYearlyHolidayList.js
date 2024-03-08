const fs = require('fs');
const path = require('path');


exports.defineYearlyHolidayList = async (req, res) => {
    try {

        const holidaysData = req.body;

        holidaysData.status = "Draft";

        // Create the 'holidaylist' folder if it doesn't exist
        const folderPath = path.join('config/Json/holidayList');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        holidaysData.state = holidaysData.state.split(" ").join("_");

        // Save the entire array as a single JSON file
        const fileName = `holidayList_${holidaysData.state}_${holidaysData.year}.json`;
        const filePath = path.join(folderPath, fileName);

        // Save the JSON file if same file already there, overwrite;


        // Save the JSON file
        fs.writeFileSync(filePath, JSON.stringify(holidaysData, null, 2));

        console.log(`Holidays saved to ${filePath}`);

        // Respond with a success message or any other response as needed
        return res.status(200).json({ 
            message: 'Holidays saved successfully'
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


