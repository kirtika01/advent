const Course = require("../../../models/SchoolRepo/Course_old");

exports.getCourseByCourseId = async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId })
        if (course) {
            return res.status(200).json({
                status: true,
                courseId: req.params.courseId,
                Course: course
            })
        } else {
            return res.status(200).json({
                status: false,
                message: "No Course found for Course ID :: " + req.params.courseId
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