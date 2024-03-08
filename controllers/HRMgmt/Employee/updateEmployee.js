const Employee = require('../../../models/HRMgmt/Employee');
const axios = require('axios');

exports.updateEmployee = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error("Employee Not Found")
        }

        let updatedEmployee = await Employee.findOneAndUpdate({ employeeId: req.body.employeeId }, { $set: req.body.update }, { new: true })

        if (!updatedEmployee) {
            throw new Error("Unable to update Employee")
        }

        if (req.body.update.officialEmail || req.body.update.officialPhone) {
            console.log("here")

            let url = process.env.URL + '/api/v1/user/updateUser';
            let update={}

            if(req.body.update.officialEmail)update.registeredEmailId=req.body.update.officialEmail
            if(req.body.update.officialPhone)update.registeredPhoneNo=req.body.update.officialPhone

            let body={
                employeeId:employee.employeeId,
                userName:employee.userName,
                update:update
            }

            console.log(body)

            let platform;
            if (req.body.isActivation === true || req.body.isActivation === 'true') {
                platform = "activation"
            }
            else {
                platform = "employeeWeb"
            }

            let userResponse = await axios.put(url, body,
                {
                    headers: {
                        Authorization: req.headers.authorization,
                        platform: platform
                    }
                })
    
            console.log(userResponse.data, 'userResponse')
    
            if (userResponse.status != 200) {
                throw new Error ("Cannot update user details")
            }

        }

        res.status(200).json({
            status: true,
            message: "Employee Updated successfully",
            employee: updatedEmployee
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}

// async function readTheFile(pathObj, documentName, docType, req) {
//     try {

//         //////////////////////////////////////////////////////////////////////
//         console.log(pathObj, 'pathObj')
//         // console.log(path.join('../../../employeeCredentials', pathObj.originalname))
//         const filePath = path.resolve(__dirname, 'employeeCredentials', pathObj.originalname)
//         // path.resolve('..', '..', '..', 'employeeCredentials', pathObj.originalname);
//         let buffer = fs.readFileSync(filePath, { flag: 'r' })
//         console.log(buffer, 'data')
//         let link = await uploadDocument(buffer, pathObj.originalname, documentName, docType, req.body.employeeId)
//         console.log('from read file')
//         fs.unlink(filePath, err => {
//             if (err) {
//                 // throw err
//             } else {
//                 console.log('File is deleted.')
//             }
//         })

//         return link


//     } catch (err) {

//         throw new Error(err)

//     }


// }

// async function uploadDocument(buffer, originalname, documentName, docType, employeeId) {
//     try {

//         let filetype = originalname.split('.')[1];


//         if (docType === 'pdf' && filetype !== 'pdf') {
//             throw new Error('Please upload a pdf file')
//         } else if (docType === 'image' && (filetype !== 'jpeg' && filetype !== 'png' && filetype !== 'jpg')) {
//             throw new Error('Please upload a jpeg or png file')
//         }

//         let fileName = `${employeeId}/${documentName}.${filetype}`;

//         const s3 = new AWS.S3(config);

//         let s3Upload = await s3.upload(
//             {
//                 Bucket: process.env.BUCKET_NAME,
//                 Key: "Employee" + '/' + fileName,
//                 Body: buffer,
//                 ACL: 'public-read'
//             }
//         ).promise()

//         console.log('from upload document')
//         return s3Upload.Location

//     } catch (err) {
//         throw new Error(err)
//     }

// }


// let url = process.env.URL + '/api/v1/user/upadateUser';

// let body = {
//     userName: req.body.userName,
//     isActive: req.body.isActive,
//     userFullName: req.body.userFirstName + ' ' + req.body.userMiddleName + ' ' + req.body.userLastName,
//     userFirstName: req.body.userFirstName,
//     userMiddleName: req.body.userMiddleName,
//     userLastName: req.body.userLastName,
//     registeredEmailId: req.body.registeredEmailId,
//     registeredPhoneNo: req.body.registeredPhoneNo,
//     userType: req.body.userType,
//     isEmployee: req.body.isEmployee,
//     employeeId: req.body.employeeId
// }

// let platform
// if (req.body.isActivation == true) {
//     platform = "activation"
// }
// else {
//     platform = "employeeWeb"
// }

// let userResponse = await axios.post(url, body,
//     {
//         headers: {
//             Authorization: req.headers.authorization,
//             platform: platform
//         }
//     })

//     if (userResponse.data.status === false) {
//         throw new Error(userResponse.data.message)
//     }

// if (req.body.employeePhoto) {
//     let employeePhoto = await uploadDocument(req.body.employeePhoto, 'employeePhoto', 'image', req.body.employeeId)
//     employee.employeePhoto = employeePhoto
// }

// return;
// req.files.degreeScan.shift()
// console.log(req.files, 'files list after pop')
// console.log(path.resolve('..', '..', '..', 'employeeCredentials'))
// return;

// if (req.files.aadharScan) {
//     let link = await readTheFile(req.files.aadharScan[0], 'aadharScan', 'pdf', req)
//     console.log(link, 'link')
//     req.body.aadharScan = link
// }

// if (req.files.panScan) {
//     let link = await readTheFile(req.files.panScan[0], 'panScan', 'pdf', req)
//     req.body.panScan = link;
// }

// if (req.files.passportScan) {
//     let link = await readTheFile(req.files.passportScan[0], 'passportScan', 'pdf', req)
//     req.body.employeePassport = JSON.parse(req.body.employeePassport)
//     req.body.employeePassport.passportScan = link;
// }

// if (req.body.educationalDetails) {
//     req.body.educationalDetails = JSON.parse(req.body.educationalDetails);
//     await req.body.educationalDetails.reduce(async (promise, item, index) => {
//         await promise;
//         if (req.files.degreeScan) {
//             let len = req.files.degreeScan.length;
//             let link = await readTheFile(req.files.degreeScan[index], `degreeScan${new Date().getTime()}`, 'pdf', req)
//             console.log(link, 'link')
//             item.degreeScan = link;
//             // req.files.degreeScan.shift();
//         }
//         if (req.files.marksheetScan) {
//             let len = req.files.marksheetScan.length;
//             let link = await readTheFile(req.files.marksheetScan[index], `marksheetScan${new Date().getTime()}`, 'pdf', req)
//             console.log(link, 'link')
//             item.marksheetScan = link;
//             // req.files.marksheetScan.shift();
//         }
//     }, Promise.resolve());
// }

// if (req.body.previousEmployerDetails) {
//     req.body.previousEmployerDetails = JSON.parse(req.body.previousEmployerDetails);
//     await req.body.previousEmployerDetails.reduce(async (promise, item, index) => {
//         await promise;
//         if (req.files.experienceLetterScan) {
//             let len = req.files.experienceLetterScan.length;
//             let link = await readTheFile(req.files.experienceLetterScan[index], `experienceLetterScan${new Date().getTime()}`, 'pdf', req)
//             console.log(link, 'link')
//             item.experienceLetterScan = link;
//             // req.files.experienceLetterScan.shift();
//         }
//         if (req.files.relivingLetterScan) {
//             let len = req.files.relivingLetterScan.length;
//             let link = await readTheFile(req.files.relivingLetterScan[index], `relivingLetterScan${new Date().getTime()}`, 'pdf', req)
//             console.log(link, 'link')
//             item.relivingLetterScan = link;
//             // req.files.relivingLetterScan.shift();
//         }
//         if (req.files.additionalDocumentScan) {
//             let len = req.files.additionalDocumentScan.length;
//             let link = await readTheFile(req.files.additionalDocumentScan[index], `additionalDocumentScan${new Date().getTime()}`, 'pdf', req)
//             console.log(link, 'link')
//             item.additionalDocumentScan = link;
//             // req.files.additionalDocumentScan.shift();
//         }
//     }, Promise.resolve());
// }

// if (req.body.educationalDetails.degreeScan) {
//     let degreeScan = await uploadDocument(req.body.educationalDetails.degreeScan, 'degreeScan', 'pdf', req.body.employeeId)
//     employee.educationalDetails.degreeScan = degreeScan
// }

// if (req.body.educationalDetails.marksheetScan) {
//     let markSheetScan = await uploadDocument(req.body.educationalDetails.marksheetScan, 'markSheetScan', 'pdf', req.body.employeeId)
//     employee.educationalDetails.marksheetScan = markSheetScan
// }

// if (req.body.previousEmployerDetails.experienceLetterScan) {
//     let experienceLetterScan = await uploadDocument(req.body.previousEmployerDetails.experienceLetterScan, 'pdf', 'experienceLetterScan', req.body.employeeId)
//     employee.previousEmployerDetails.experienceLetterScan = experienceLetterScan
// }

// if (req.body.previousEmployerDetails.relivingLetterScan) {
//     let relivingLetterScan = await uploadDocument(req.body.previousEmployerDetails.relivingLetterScan, 'pdf', 'relivingLetterScan', req.body.employeeId)
//     employee.previousEmployerDetails.relivingLetterScan = relivingLetterScan
// }

// if (req.body.previousEmployerDetails.additionalDocumentScan) {
//     let additionalDocumentScan = await uploadDocument(req.body.previousEmployerDetails.additionalDocumentScan, 'pdf', 'additionalDocumentScan', req.body.employeeId)
//     employee.previousEmployerDetails.additionalDocumentScan = additionalDocumentScan
// }

// console.log({...employee})

// if (req.body.presentAddress) {
//     req.body.presentAddress = JSON.parse(req.body.presentAddress)
// }

// if (req.body.permanentAddress) {
//     req.body.permanentAddress = JSON.parse(req.body.permanentAddress)
// }

// if (req.body.emergencyContact) {
//     let emergencyContact = JSON.parse(req.body.emergencyContact)
//     req.body.emergencyContact = emergencyContact
// }

// console.log(req.body)
// console.log(req.files)

// return;
