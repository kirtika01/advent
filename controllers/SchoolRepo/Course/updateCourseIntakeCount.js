const Course = require("../../../models/SchoolRepo/Course_old");

exports.updateCourseIntakeCount = async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.body.courseId })

        if(course){
            if(course.intake!=null){

                const intake =course.intake;
                const iscyclepresent = intake.find(({ cycle }) => cycle === `${req.body.cycle}`);
                
                


                if(iscyclepresent){
                    iscyclepresent.totalCount=req.body.update.totalCount
                    iscyclepresent.availableCount=req.body.update.availableCount
                    
                    const updateintake =await Course.findOneAndUpdate({courseId: req.body.courseId,"intake.cycle":req.body.cycle},{ "$set": { "intake.$":iscyclepresent} },{new:true})
                    

                    if(updateintake){
                        return res.status(200).json({
                            status: true,
                            message: "Course intake Updated successfully ",
                            courseId:req.body.courseId,
                            Result:updateintake,
                        })
                    }
                    else{
                        throw new Error("Unable to update Cycle.")
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
                throw new Error("No Item to update")
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