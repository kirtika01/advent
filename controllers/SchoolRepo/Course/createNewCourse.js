//write a controller createNewCourse.js and import Course Model
const Course = require("../../../models/School/Course");
const Counter = require("../../../models/Counter");
const School = require("../../../models/School/School");

exports.createNewCourse = async (req, res) => {
    try{

        const checkSchool = await School.findOne({schoolId:req.body.schoolId})

        if(!checkSchool){
            throw new Error("School Not Found For School Id::"+req.body.schoolId)
        }

        let counter = await Counter.findOneAndUpdate({ identifierName: "Coursecode" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        const courseId = `CRS-${req.body.schoolId}-` +counter.count ;
            

        let courseexists = await Course.findOne({courseName:req.body.courseName,parentSchoolId:req.body.schoolId});

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
    catch(err){

        console.log(err);
        return res.status(500).json({
            status: false,
            error: err.toString()
        })

    }
}
