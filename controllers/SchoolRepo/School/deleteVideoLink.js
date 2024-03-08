const School = require("../../../models/School/School");
const moment = require("moment");

exports.deleteVideoLink= async (req, res) => {
    try {
        const school= await School.findOne({schoolId:req.body.schoolId})

        if(school){
            const updatevideolinkarray = await School.findOneAndUpdate( {schoolId:req.body.schoolId},{ $pull: { 'videolink': { link: req.body.link } } },{ new: true });
        
            if(updatevideolinkarray){
                return res.status(200).json({
                    status: true,
                    message: "Successfully deleted video from School",
                    schoolId:req.body.schoolId,
                    Result:updatevideolinkarray,
                })
            }
            else{
                throw new Error("Unable to delete video link",)
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