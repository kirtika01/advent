const AWS = require('aws-sdk');
const awsConfig = require('../../config/aws-s3');

module.exports = {
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
  };