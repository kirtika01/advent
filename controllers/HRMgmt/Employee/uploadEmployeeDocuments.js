const Employee = require("../../../models/HRMgmt/Employee");
const FileUpload = require('../../Utils/AwsSingleUpload');

exports.uploadEmployeeDocuments = async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeId: req.body.employeeId })

        if (!employee) {
            throw new Error("Employee Not Found")
        }

        if (!req.file) {

            throw new Error('File required!')
        }

        else if (req.file.size > 4 * 1024 * 1024) {
            throw new Error(
                "Max File size of 4MB exceeded"
            )
        }
        let file = req.file.originalname.split('.');
        fileType = file[file.length - 1];
        console.log(fileType)

        if (fileType === "pdf") {

            console.log("OK")

        }
        else {
            throw new Error('Only PDF files are allowed')
        }

        let fullFileName = `${employeeId}/${documentType}.${filetype}`;
        const filee = req.file.buffer;
        const fileName = `Employee/` + fullFileName;

        const url = await FileUpload.upload(filee, fileName);

        if (!url) {
            throw new Error("Error in Uploading Employee Photo")
        }

        if (req.body.documentType === "employeePAN") {
            employee.employeePAN = req.body.employeePAN
            employee.panScan = url
        }
        if (req.body.documentType === "employeeAadhar") {
            employee.employeeAadhar = req.body.employeeAadhar
            employee.aadharScan = url
        }
        if (req.body.documentType === "employeePassport") {
            let passport= {
                passportNo: req.body.passportNo,
                passportScan: url,
                issueDate: req.body.issueDate,
                expiryDate: req.body.expiryDate,
                placeOfIssue: req.body.placeOfIssue,
                countryOfIssue: req.body.countryOfIssue
            }
            employee.employeePassport = passport
        }
        if (req.body.documentType ==="educationalDetails"){
            let educationalDetails = {
                qualification: req.body.qualification,
                schoolInstitute: req.body.schoolInstitute,
                universityBoard: req.body.universityBoard,
                score: req.body.score,
                scoreType: req.body.scoreType,
                yearOfPassing: req.body.yearOfPassing,
                city: req.body.city,
                State: req.body.State,
                country: req.body.country,
                degreeScan: url,
                marksheetScan: url
            }
            employee.educationalDetails.push(educationalDetails)
        
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}