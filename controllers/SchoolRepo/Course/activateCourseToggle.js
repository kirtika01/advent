const Course = require("../../../models/SchoolRepo/Course_old");

exports.activateCourseToggle = async (req, res) => {
    try {
        const updatecourse=await Course.findOneAndUpdate({courseId:req.body.courseId},[{"$set": {isActive: {"$not": "$isActive"}}}],{new:true})

        if (!updatecourse) {
            throw new Error(
                "Course Not Found"
            )
        }
        else {
            return res.status(200).json({
                status: true,
                message: "Updated",
                Course: updatecourse
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