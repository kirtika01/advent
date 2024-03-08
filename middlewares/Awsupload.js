const AWS = require('aws-sdk');
const awsConfig = require('../config/aws-s3');


module.exports = {

  upload: async (file,fileName) => {

    const s3=new AWS.S3(awsConfig);
    
    const params = {
      Bucket:process.env.BUCKET_NAME,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    }
    const result = await s3.upload(params).promise();
    return result.Location;
  },

  delete: async (fileName)=>{

    const s3=new AWS.S3(awsConfig);
    //console.log(fileName);

    const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
    }
    s3.deleteObject(deleteParams, (err, data) => {
        if (err) {
            console.log(err);
            throw new Error(
                "Error in deleting"
            )
        } else {
            return data;      
        }
    });
  },

  multipleupload: async (files) =>{

    const s3=new AWS.S3(awsConfig);

    const uploadPromises = files.map(async (file) => {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
        };
        const result = await s3.upload(params).promise();
        return result.Location;
    });
    return Promise.all(uploadPromises);
  }
};