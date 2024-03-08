const Course = require("../../../models/SchoolRepo/Course_old");

exports.addCourseIntake = async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.body.courseId })

        if(course){

            const intake =course.intake;
            
            let coursecycleexists = intake.find(({ cycle }) => cycle === `${req.body.intake.cycle}`);

            //console.log(coursecycleexists);
            if(coursecycleexists){
                throw new Error("This Cycle already Present for CourseId- "+req.body.courseId)
            }
            else{
                const addintake=await Course.findOneAndUpdate({courseId:req.body.courseId},{ $push: {intake:req.body.intake} },{new:true})

                if(addintake){
                    return res.status(200).json({
                        status: true,
                        message: "Course intake added successfully ",
                        courseId:req.body.courseId,
                        Result:addintake,
                    })
                }else{
                    throw new Error("Unable to add intake")
                }
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