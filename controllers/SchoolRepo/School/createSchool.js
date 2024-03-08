const School = require("../../../models/SchoolRepo/School");
const Counter= require("../../../models/Counter");

exports.createSchool = async (req, res) => {
    try {

        const school =req.body;

        let counter = await Counter.findOneAndUpdate({ identifierName: "School" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        let schoolId="SCHOOL-" + counter.count;
        let schoolCode=req.body.schoolCode;
        
        let specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(req.body.schoolCode);
        let numsAndSmalls = /[a-z0-9]/.test(req.body.schoolCode);
        
        if(schoolCode.length!=4||specialChars==true||numsAndSmalls==true){
            throw new Error("School Id Must Be Of 4 Capital Characters")
        }
    

        

        const newschool = new School(school);

        newschool.schoolId =schoolId;
        newschool.schoolCode =schoolCode;


        let doc = await newschool.save();

        if (!doc) {
            throw new Error(
                "Unable to Create New School"
            )
        }
        else {
            return res.status(200).json({
                status: true,
                message: "New School Successfully Created",
                School: doc
            })
        }
    }
    catch (err) {
        let counter = await Counter.findOneAndUpdate({ identifierName: "School" }, { $inc: { count: -1 } }, { upsert: true, new: true })
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
}
}