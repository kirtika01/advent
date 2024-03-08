const Course = require("../../../models/SchoolRepo/Course_old");

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.body.courseId })

        if (course) {

            const updatecourse=await Course.findOneAndUpdate({courseId:req.body.courseId},req.body.update,{new:true})
            if(updatecourse){
                return res.status(200).json({
                    status: true,
                    message: "Course successfully updated",
                    courseId:req.body.courseId,
                    Result:updatecourse,
                })
            }else{
                throw new Error("Unable to update course")
            } 
        }
        else {
            return res.status(200).json({
                status:false,
                message: "Course not found with course Id ::" + req.body.courseId,
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