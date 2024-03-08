const Claim = require('../../../models/HRMgmt/Claims');
const AWS = require('aws-sdk');
const awsConfig = require('../../../config/aws-s3')
const moment = require('moment');

exports.uploadSupportingDocument = async (req, res) => {
    try {
        let { claimId, fileName } = req.body;
        const claim = await Claim.findOne({ claimId: claimId });
        //console.log(claim);
        if (claim) {
            if (!req.file) {
                throw new Error("File is not provided.")
            }
            else {
                let file = req.file.originalname.split('.');
                const fileType = file[file.length - 1];
                 fileName = fileName.split(' ').join('_');
               
                let docType = fileType
                if (fileType == "pdf") { docType = "pdf" }
                else if (fileType == "jpg" || fileType == "jpeg") { docType = "jpg" }
                else if (fileType == "png" || fileType == "pneg") { docType = "png" }
                else if (fileType == "docx" || fileType == "doc") { docType = "doc" }
                else { docType = "other" }

               
                if (req.file.size > 2 * 1024 * 1024) {
                    throw new Error(
                        "Max File size exceeded"
                    )
                }

                const fullFileName = `${req.body.claimId}_${fileName}.${fileType}`

                const s3=new AWS.S3(awsConfig);

                var s3Upload = s3.upload(
                    {
                        Bucket: process.env.BUCKET_NAME,
                        Key: "claimsDoc" + '/' + fullFileName,
                        Body: req.file.buffer,
                        ACL: 'public-read'
                    }
                ).promise()

                s3Upload

                    .then(async (data) => {

                        const document = {
                            docType: docType,
                            docLink: data.Location,
                            docName: fileName+"."+fileType,
                            uploadDate : moment()
                        }

                        const updateclaim = await Claim.findOneAndUpdate({ claimId: claimId }, { $push: { supportingDocument: document } }, { new: true })

                        if (updateclaim) {
                            return res.status(200).json({
                                status: true,
                                message: "Documents Successfully Uploaded"
                            })
                        }
                        else {
                            throw new Error("Unable to upload claim Documents")
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        throw new Error(`Error in uploading  documents for Claim`)
                    });
            }
        }
        else {
            throw new Error(
                "Claim Not Found."
            )
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }
}