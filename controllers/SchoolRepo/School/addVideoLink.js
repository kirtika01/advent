const School = require("../../../models/SchoolRepo/School");
const moment = require("moment");

exports.addVideoLink = async (req, res) => {
    try {
        const school= await School.findOne({schoolId:req.body.schoolId})

        if(school){
            const newlink ={...req.body.videolink ,date:new Date()}

            const updateschool = await School.findOneAndUpdate({schoolId:req.body.schoolId}, { $push: {videolink:newlink} }, { new: true })
        
            if(updateschool){
                return res.status(200).json({
                    status: true,
                    message: "School successfully updated",
                    schoolId:req.body.schoolId,
                    Result:updateschool,
                })
            }
            else{
                return res.status(200).json({
                    status:false,
                    message: "Unable to add video link",
                })
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
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}