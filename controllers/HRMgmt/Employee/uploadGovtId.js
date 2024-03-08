const Employee = require('../../../models/HRMgmt/Employee');
const FileUpload = require('../../Utils/AwsSingleUpload');
const FileDelete = require('../../Utils/AwsSingleDelete');

exports.uploadGovtId = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error("Employee Not Found")
        }

        if (!req.file) {
            throw new Error("Please upload a file")
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
            throw new Error('Only PDF allowed')
        }
        let deleted
        const filee = req.file.buffer;
        let fullFileName =`${req.body.employeeId}_${req.body.documentType}.${fileType}`;
        const fileName = `employeeGovtId/` + fullFileName;
        

        if (req.body.documentType == "aadhar") {

            if (employee.aadharScan){
                await deleteDocument(employee.aadharScan)
            } 
            

            const url = await FileUpload.upload(filee,fileName);
            if(!url){
                throw new Error("Error in Uploading Employee Photo")
            }
            
            employee.aadharScan = url
            employee.employeeAadhar = req.body.employeeAadhar

        }
        if (req.body.documentType == "pan") {

            if (employee.panScan){
                await deleteDocument(employee.panScan)
            } 
            

            const url = await FileUpload.upload(filee,fileName);
            if(!url){
                throw new Error("Error in Uploading Employee Photo")
            }
            
            employee.panScan = url
            employee.employeePAN = req.body.employeePAN

        }
        if (req.body.documentType == "passport") {

            if (employee.employeePassport.passportScan){
                await deleteDocument(employee.employeePassport.passportScan)
            }

            const url = await FileUpload.upload(filee,fileName);
            if(!url){
                throw new Error("Error in Uploading Employee Photo")
            }

            let employeePassport = {
                passportScan:url,
                passportNo:req.body.passportNo,
                issueDate:req.body.issueDate,
                expiryDate:req.body.expiryDate,
                placeOfIssue:req.body.placeOfIssue,
                countryOfIssue:req.body.countryOfIssue
            }
            employee.employeePassport = employeePassport
        }

        let doc = await employee.save()

        if(!doc){
            throw new Error (`Cannot Update ${req.body.documentType} details`)
        }

        res.status(200).json({
            status: true,
            message: "Document Added Successfully",
            employee: doc
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}

async function deleteDocument(employeeFile) {
    try {
        let fileName = employeeFile.split('/');
        fileName = fileName[fileName.length - 1];
        console.log(fileName);
        let deleted = await FileDelete.delete(fileName);

        return;
    }
    catch(err){
        throw new Error(err.toString());
    }
}