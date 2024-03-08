const Employee = require('../../../models/HRMgmt/Employee');
const FileUpload = require('../../Utils/AwsSingleUpload');
const FileDelete = require('../../Utils/AwsSingleDelete');

exports.addPreviousEmploymentDetails = async (req, res) => {
    try {
        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error("Employee Not Found")
        }

        if(!req.files['experienceLetterScan']){
            throw new Error("Please provide experienceLetterScan")
        }
        if(!req.files['payslipsScan']){
            throw new Error("Please provide payslipsScan")
        }


        const experienceLetterScan = req.files['experienceLetterScan'][0];
        const payslipsScan = req.files['payslipsScan'][0];

        let dateSuffix = new Date().toISOString().replace(/:/g, '-');

        let experienceLetterScanURL= await uploadDocument(experienceLetterScan,`${employee.employeeId}-experienceLetterScan-${dateSuffix}`,req.files['experienceLetterScan'][0].buffer)
        let payslipsScanURL = await uploadDocument(payslipsScan,`${employee.employeeId}-payslipsScan-${dateSuffix}`, req.files['payslipsScan'][0].buffer)
        let additionalDocumentScanURL


        if(req.files['additionalDocumentScan']){
            const additionalDocumentScan = req.files['additionalDocumentScan'][0];
            additionalDocumentScanURL = await uploadDocument(additionalDocumentScan,`${employee.employeeId}-additionalDocumentScan-${dateSuffix}`,req.files['additionalDocumentScan'][0].buffer)
        }

        let previousEmployerDetails ={
            employerName:req.body.employerName,
            designation: req.body.designation,
            department: req.body.department,
            dateOfJoining: new Date(req.body.dateOfJoining),
            dateOfLeaving: new Date(req.body.dateOfLeaving),
            lastCTC: req.body.lastCTC,
            experienceLetterScan: experienceLetterScanURL,
            payslipsScan: payslipsScanURL
        }

        if(req.files['additionalDocumentScan']){
            previousEmployerDetails ={...previousEmployerDetails,
                additionalDocumentScan: additionalDocumentScanURL}
        }
        
        const updateEmployee = await Employee.findOneAndUpdate({ employeeId: req.body.employeeId }, { $push: { previousEmployerDetails: previousEmployerDetails } }, { new: true })

        if(!updateEmployee){
            throw new Error ("Cannot add education details to employee")
        }

        res.status(200).json({
            status: true,
            message: "Employement Details Added Successfully",
            employee: updateEmployee
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

async function uploadDocument(file, documentName,buffer) {
    try {

        if (buffer.length > 4 * 1024 * 1024) {
            throw new Error(`Max File size of 4MB exceeded for ${documentName}`);
        }
        
        let newfile = file.originalname.split('.');
        fileType = newfile[newfile.length - 1];
        console.log(fileType)

        if (fileType === "pdf") {

            console.log("OK")

        }
        else {
            throw new Error('Only PDF allowed')
        }

        const filee = buffer;
        let fullFileName =`${documentName}.${fileType}`;
        const fileName = `experienceDocs/` + fullFileName;

        const url = await FileUpload.upload(filee,fileName);
        if(!url){throw new Error("Error in Uploading Document")}
        
        return url;

    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }

}

