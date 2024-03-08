const Course = require("../../../models/SchoolRepo/Course_old");

exports.getListOfcourses = async (req, res) => {
    try {
        let query = {};

        if (req.query.isActive) {
            query['isActive'] = req.query.isActive;
        }
        if (req.query.parentSchoolId) {
            query['parentSchoolId'] = req.query.parentSchoolId;
        }

        let list;

        if (Object.keys(query).length > 0) {

            list = await Course.find(query);
        } else {
            list = await Course.find()
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                No_of_Courses: list.length,
                Courses: list
                
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Available Courses',
               
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}