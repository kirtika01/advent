const School= require("../../../models/SchoolRepo/School");
const fileUpload = require('../../../middlewares/Awsupload');

exports.uploadSchoolLogo = async (req, res) => {
    try {
        const school= await School.findOne({schoolId:req.body.schoolId})

        if(school){
            if (!req.file) {
                throw new Error("File is not provided.")
            }
            else{
                if (req.file.size > 4 * 1024 * 1024) {
                    throw new Error(
                        "Max File size exceeded"
                    )
                }

                let fullFileName =`${req.body.schoolId}_${req.file.originalname}`;

                const file = req.file.buffer;
                const fileName = `schoolLogo/${req.body.schoolId}/` + fullFileName;

                if(school.schoolLogo){
                    let deleteLogo = await fileUpload.delete(school.schoolLogo);
                    if(deleteLogo){
                        throw new Error(
                            "Error in deleting Logo for School"
                        )
                    }
                }
                const url = await fileUpload.upload(file,fileName);

                if(url){

                    const updateschool = await School.findOneAndUpdate({schoolId:req.body.schoolId}, {schoolLogo:url}, { new: true })

                    if (updateschool) {
                        return res.status(200).json({
                            status: true,
                            message: "School Logo Successfully Uploaded",
                            schoolId:req.body.schoolId,
                            Result:updateschool,
                        })
                    }
                    else {
                        throw new Error("Unable to upload School Logo")
                    }                     
                }else{
                    throw new Error(
                        "Error in Uploading Logo for School"
                    )
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
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}