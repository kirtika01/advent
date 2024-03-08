const School = require("../../../models/SchoolRepo/School");
const AWS = require('aws-sdk');
const awsConfig = require('../../../config/aws-s3')

exports.deletePhotoFromGallery = async (req, res) => {

    try {

        let school = await School.findOne({ schoolId: req.body.schoolId })

        if (!school) {
            throw new Error(`School ${req.body.schoolId} not available`)
        }


        let photos = school.photoGallery.filter((photo) => {

            return photo.link === req.body.photoLink
        })

        //console.log(photos , 'before filter')

        if (photos.length === 0) {
            throw new Error(`Photo not available`)
        }

        let fileName = req.body.photoLink.split('/');
        fileName = fileName[fileName.length - 1];
        //console.log(fileName)

        const s3 = new AWS.S3(awsConfig);

        var keyName = "school/gallery/" + fileName
        const params = {
            Bucket: awsConfig.bucket,
            Key: keyName //if any sub folder-> path/of/the/folder.ext
        }


         await findFile(params, s3)

        //console.log(res)

        photos = school.photoGallery.filter((u) => {
            return req.body.photoLink !== u.link
        })

        console.log(photos , 'after filter')

        school.photoGallery = photos

        let doc = await school.save();

        if (!doc) {
            throw new Error(`Unable to delete school photo. Contact administrator`)
        } else {
            return res.status(200).json({
                status: true,
                message: 'School photo successfully deleted'
            })
        }

    } catch (err) {
        console.log(err.toString())
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}

const findFile = async (params, s3) => {

    await s3.headObject(params).promise()
        .then(async () => {
            console.log("File Found in S3")
            return await deleteFile(params, s3)
        })
        .catch((err) => {
            console.log('not found')
            return;
        })

}

const deleteFile = async (params, s3) => {

    await s3.deleteObject(params).promise()
        .then(async () => {
            console.log('maybe deleted')
            await findFile(params, s3)

        })
        .catch((err) => {
            // throw new Error("Unable to delete the previous uploaded image.")
            return res.status(500).json({
                status: false,
                error: "Unable to delete the image." + err.code
            })
        })

}