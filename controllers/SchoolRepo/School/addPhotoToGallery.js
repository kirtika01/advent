const School = require("../../../models/SchoolRepo/School");
const fileUpload = require('../../../middlewares/Fileupload');
const awsConfig = require('../../../config/aws-s3');
const AWS = require('aws-sdk');

exports.addPhotoGallery = async (req, res) => {
    try {
        const school = await School.findOne({ schoolId: req.body.schoolId })

        if (school) {
            if (!req.file) {
                throw new Error("File is not provided.")
            }
            else {

                let file = req.file.originalname.split('.');
                const fileType = file[file.length - 1];

                const fileName = req.body.schoolId + "-" + new Date() + "." + req.file.originalname

                const s3 = new AWS.S3(awsConfig);

                var s3Upload = s3.upload(
                    {
                        Bucket: process.env.BUCKET_NAME,
                        Key: "school/gallery/" + fileName,
                        Body: req.file.buffer,
                        ACL: 'public-read'
                    }
                ).promise()

                return s3Upload.then(async (data) => {

                    console.log("Hiii")

                    const newPhoto = {
                        link: data.Location,
                        date: new Date(),
                        comment: 'New Photo Uploaded in the gallery'
                    }

                    console.log(newPhoto)

                    let updatedSchool = await School.findOneAndUpdate({ schoolId: req.body.schoolId }, { $push: { photoGallery: newPhoto } }, { new: true })

                    //console.log(school)

                    if (updatedSchool) {
                        return res.status(200).json({
                            status: true,
                            school: updatedSchool,
                            message: "School Picture Successfully Uploaded"
                        })
                    }
                    else {
                        throw new Error("Unable to upload School Photo")
                    }

                })

            }
        }
        else {
            return res.status(200).json({
                status: false,
                message: "School Not Found For School Id::" + req.body.schoolId
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