const Employee= require("../../models/Employee");
const Counter= require("../../models/Counter");

const awsConfig = require('../../../config/aws-s3');
const AWS = require('aws-sdk');


exports.createNewEmployee = async (req, res) => {
    try{
        let employee = req.body;

        
        let newEmployee = new Employee(employee)

        
        newEmployee.employeeFullName = employee.employeeFirstName
        if (employee.employeeFirstName) {
            newEmployee.employeeFullName = newEmployee.employeeFullName + ' ' + employee.employeeMiddleName
        }
        newEmployee.userFullName = newEmployee.userFullName + ' ' + employee.employeeLasttName


       let doc = await newEmployee.save()

        if(employee.employeePhoto){
       
            if (!req.employeePhoto) {
                throw new Error("File is not provided.")
            }
            else {

                let file = req.file.originalname.split('.');
                const fileType = file[file.length - 1];

                const fileName = employee.employeeId + "-" + new Date() + "." + fileType

                const s3 = new AWS.S3(awsConfig);

                var s3Upload = s3.upload(
                    {
                        Bucket: process.env.BUCKET_NAME,
                        Key: "hrmgmt/employee/" + fileName,
                        Body: req.file.buffer,
                        ACL: 'public-read'
                    }
                ).promise()

                return s3Upload.then(async (data) => {

                    console.log("Hiii")

                    newEmployee.employeePhoto= data.Location;

                    let doc = await newEmployee.save()

                    
                    //console.log(school)

                    if (doc) {
                        console.log("Photo uploaded")
                    }
                    else {
                        throw new Error("Unable to upload School Photo")
                    }

                })

            }
        }

        if (doc) {

            return res.status(200).json({
                status: true,
                employee: newEmployee,
                message: `Employee - ${newEmployee.employeeId} created`
            })

        }
        else{
            throw new Error("Unable to save new Employee");
        }
    }

    catch (err) {
        console.log(err);
        //var counter = await Counter.findOneAndUpdate({identifierName: "Employee"}, {$inc: {count: -1}}, {new:true});
            return res.status(500).json({
            status: false,
            error: err,
            });

    }


};