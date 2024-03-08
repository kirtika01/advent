const Course = require("../../../models/SchoolRepo/Course_old");
const School= require("../../../models/SchoolRepo/School");
const Counter= require("../../../models/Counter");

exports.createNewCourse = async (req, res) => {
    try {
        const school= await School.findOne({schoolId:req.body.schoolId})

        if(school){
            let courseCode= req.body.courseCode
            if(req.body.courseCode.length!=4){
                throw new Error("Course Code Must Be Of 4 Characters")
            }
            let specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(req.body.courseCode);
            let numsAndSmalls = /[a-z0-9]/.test(req.body.courseCode);

            
            if(specialChars==true||numsAndSmalls==true){
                throw new Error("Course Code Must Be Of Capital Letters Only")
            }

            //let counter = await Counter.findOneAndUpdate({ identifierName: "Coursecode" }, { $inc: { count: 1 } }, { upsert: true, new: true })
            const courseId = `CRS-${req.body.schoolId}-` +courseCode ;
            

            let courseexists = await Course.findOne({courseId:courseId});

            if(courseexists){
                throw new Error("Course Already exists")
            }
            else{
                const newcourse = new Course(req.body.course);

                newcourse.courseId =courseId;
                newcourse.parentSchoolId=req.body.schoolId;

                let doc = await newcourse.save();

                if (!doc) {
                    throw new Error(
                        "Unable to Create New Course"
                    )
                }
                else {
                    return res.status(200).json({
                        status: true,
                        message: "New Course Successfully Created",
                        Course: doc
                    })
                }
            }
        }
        else{
            return res.status(200).json({
                status:false,
                message: "School Not Found For School Id::"+req.body.schoolId
            })
        }
    }
    catch (err) {
        let counter = await Counter.findOneAndUpdate({ identifierName: "Coursecode" }, { $inc: { count: -1 } }, { upsert: true, new: true })
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}