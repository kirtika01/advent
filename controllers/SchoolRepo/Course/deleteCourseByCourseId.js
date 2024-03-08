const Course = require("../../../models/SchoolRepo/Course_old");

exports.deleteCourseByCourseId = async (req, res) => {
    try {

        const deletecourse = await Course.findOneAndDelete({ courseId: req.body.courseId });
        if (deletecourse) {
                res.status(200).json({
                status: true,
                message: "Course deleted successfully",
            });
        } 
        else {
                res.status(200).json({
                status: false,
                message: "Course not found",
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}