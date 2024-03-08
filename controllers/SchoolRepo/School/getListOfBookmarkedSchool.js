const School = require('../../../models/SchoolRepo/School');
const Employee = require('../../../models/HRMgmt/Employee');


exports.getListOfBookmarkedSchool = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.params.employeeId });

        if (!employee) {
            throw new Error('Employee not found')
        }

        let employeeBookmark = employee.schoolBookmark;

        //loop through the bookmarked schools and get the schoolId in an array
        let bookmarkedSchools = employeeBookmark.map((bookmark) => {
            return bookmark.schoolId
        })
        

        // console.log(bookmarkedSchools, 'yes');

        let bookmarks = await School.find({ schoolId: { $in: bookmarkedSchools } });

        //console.log(isCorect)
        if (bookmarks.length === 0) {
            return res.status(200).json({
                status: false,
                message: 'No bookmarked school found'
            })
        }
        return res.status(200).json({
            status: true,
            bookmarks : bookmarks
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            message: err.toString()
        })
    }
}