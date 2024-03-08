const School = require("../../../models/SchoolRepo/School");

exports.updateSchoolDetailsBySchoolId = async (req, res) => {
    try {
        const school = await School.findOne({ schoolId: req.body.schoolId })

        if (school) {

            const updateschool=await School.findOneAndUpdate({schoolId:req.body.schoolId},req.body.update,{new:true})
            if(updateschool){
                return res.status(200).json({
                    status: true,
                    message: "School successfully updated",
                    schoolId:req.body.schoolId,
                    Result:updateschool,
                })
            }else{
                return res.status(200).json({
                    status:false,
                    message: "Unable to update School",
                })

            } 
        }
        else {

            throw new Error(`School with SchoolId ${req.body.schoolId} does not exist.`)
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}