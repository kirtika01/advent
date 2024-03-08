const Employee = require('../../../models/HRMgmt/Employee');
const axios = require('axios');
const AWS = require('aws-sdk');
const config = require('../../../config/aws-s3');


exports.onboardEmployee = async (req, res) => {
    try {

        let chkEmployee = await Employee.findOne({ employeeId: req?.body?.employeeId });

        if (chkEmployee) {
            throw new Error("Employee ID already exist")
        }

        let employee = new Employee(req.body);

        let fullName = ""
        if (req.body.salutation) { fullName = fullName + req.body.salutation + " " }
        fullName += req.body.employeeFirstName
        if (req.body.employeeMiddleName) { fullName = fullName + " " + req.body.employeeMiddleName }
        fullName = fullName + " " + req.body.employeeLastName

        employee.employeeFullName = fullName

        let url = process.env.URL + '/api/v1/user/createUser';
        let body = {
            userName: req.body.userName,
            isActive: req.body.isActive,
            userFullName: req.body.employeeFirstName + ' ' + req?.body?.employeeMiddleName + ' ' + req.body.employeeLastName,
            userFirstName: req.body.employeeFirstName,
            userMiddleName: req.body.employeeMiddleName,
            userLastName: req.body.employeeLastName,
            registeredEmailId: req.body.officialEmail,
            registeredPhoneNo: req.body.officialPhone,
            userType: req.body.userType,
            isEmployee: true,
            employeeId: req.body.employeeId
        }

        let platform;
        if (req.body.isActivation === true || req.body.isActivation === 'true') {
            platform = "activation"
        }
        else {
            platform = "employeeWeb"
        }

        // console.log(platform, 'from onboard', req.headers.platform)
        console.log("This is Body:::::::::::::")
        console.log(body)
        let userResponse = await axios.post(url, body,
            {
                headers: {
                    Authorization: req.headers.authorization,
                    platform: platform
                }
            })

        console.log(userResponse.data, 'userResponse')

        if (userResponse.status === 500) {
            throw new Error ("Employee not created")
        }

        console.log('break1')

        if (userResponse.data.status === false) {
            throw new Error ("Please insert unique Username, Email Id or Phone no.")
        }

        console.log('break2')

        // console.log(req.file, 'req.file')
        // if (req.file) {
        //     let employeePhoto = await uploadDocument(req.file, 'employeePhoto', 'image', req)
        //     console.log(employeePhoto, 'employeePhoto')
        //     employee.employeePhoto = employeePhoto
        // }

        console.log('break3')

        // console.log(employee)
        // return;


        let doc = await employee.save();

        if(!doc){
            throw new Error("Cannot onboard Employee")
        }

        return res.status(200).json({
            status: true,
            message: "Employee created successfully",
            employee: employee
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}


// async function uploadDocument(file, documentName, docType, req) {
//     try {

//         let filetype = file.originalname.split('.')[1];

//         if (docType === 'pdf' && filetype !== 'pdf') {
//             throw new Error('Please upload a pdf file')
//         } else if (docType === 'image' && (filetype !== 'jpeg' && filetype !== 'png' && filetype !== 'jpg')) {
//             throw new Error('Please upload a jpeg or png or jpg file')
//         }

//         let fileName = `${req.body.employeeId}/${documentName}.${filetype}`;

//         const s3 = new AWS.S3(config);

//         let data = await s3.upload(
//             {
//                 Bucket: process.env.BUCKET_NAME,
//                 Key: "Employee" + '/' + fileName,
//                 Body: file.buffer,
//                 ACL: 'public-read'
//             }
//         ).promise()

//         console.log(data.Location, 'from upload doc')
//         return data.Location

//     } catch (err) {
//         return res.status(500).json({
//             status: false,
//             error: err.toString()
//         })
//     }

// }