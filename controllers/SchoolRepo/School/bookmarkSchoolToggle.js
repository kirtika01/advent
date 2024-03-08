const Employee = require('../../../models/HRMgmt/Employee');
const School = require('../../../models/SchoolRepo/School');

exports.bookmarkSchoolToggle = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.body.employeeId })

        if(!employee){
            throw new Error('Employee not found')
        }

        let school = await School.findOne({ schoolId: req.body.schoolId })

        if(!school){
            throw new Error('School not found')
        }


        if (req.body.bookmark === true) {

            if (employee.schoolBookmark.find(e => e.schoolId===req.body.schoolId)) {
                throw new Error('School already bookmarked')
            } 

            if (employee.schoolBookmark.length === 20) {
                throw new Error('You have filled up your limit of 20 schools')
            }

            employee.schoolBookmark.push({ schoolId: req.body.schoolId })
            await employee.save();


            return res.status(200).json({
                status: true,
                message: `Bookmark Sucessfully Added : ${school.schoolName}`
            })
            
        } else if (req.body.bookmark === false) {
            let bookmarks = employee.schoolBookmark.filter((bookmark) => {
                return bookmark.schoolId !== req.body.schoolId
            })

            employee.schoolBookmark = bookmarks

            await employee.save();

            return res.status(200).json({
                status: true,
                message: `Bookmark Sucessfully removed : ${school.schoolName}`
            })
        }

        

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            message: err.toString()
        })
    }
}