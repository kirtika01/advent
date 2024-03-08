const fs = require('fs');
const path = require('path');


exports.defineYearlyHolidayList = async (req, res) => {
    try {

        const holidaysData = req.body;

        // Create the 'holidaylist' folder if it doesn't exist
        const folderPath = path.join('holidaylist');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Save the entire array as a single JSON file
        const fileName = 'holidays.json';
        const filePath = path.join(folderPath, fileName);

        // Save the JSON file
        fs.writeFileSync(filePath, JSON.stringify(holidaysData, null, 2));

        console.log(`Holidays saved to ${filePath}`);

        // Respond with a success message or any other response as needed
        res.status(200).json({ message: 'Holidays saved successfully' });

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}