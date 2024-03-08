const Course = require("../../../models/SchoolRepo/Course_old");

exports.deleteCourseIntake = async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.body.courseId })

        if(course){
            if(course.intake!=null){

                const intake =course.intake;
                const iscyclepresent = intake.find(({ cycle }) => cycle === `${req.body.cycle}`);

                if(iscyclepresent){
                    const deleteintake =await Course.findOneAndUpdate({courseId: req.body.courseId },{'$pull':{ 'intake':{'cycle': req.body.cycle }}},{new:true});

                    if(deleteintake){
                        return res.status(200).json({
                            status: true,
                            message: "Course intake deleted successfully ",
                            courseId:req.body.courseId,
                            Result:deleteintake,
                        })
                    }
                    else{
                        throw new Error("Unable to delete Cycle.")
                    }
                }
                else{
                    return res.status(200).json({
                        status: false,
                        message: " This Cycle is not available for the Course Id"+req.body.courseId
                    })
                }

                
            }
            else{
                throw new Error("No Item to delete")
            }
        }
        else {
            return res.status(200).json({
                status: false,
                message: "No Course found for Course ID :: " + req.body.courseId
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