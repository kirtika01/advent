const Employee = require('../../../models/HRMgmt/Employee');
const FileUpload = require('../../Utils/AwsSingleUpload');
const FileDelete = require('../../Utils/AwsSingleDelete');

exports.addEducationalDetails = async (req, res) => {
    try {
        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error("Employee Not Found")
        }

        if(!req.files['degreeScan']){
            throw new Error("Please provide degreeScan")
        }
        if(!req.files['marksheetScan']){
            throw new Error("Please provide marksheetScan")
        }

        
        const degreeScan = req.files['degreeScan'][0];
        const marksheetScan = req.files['marksheetScan'][0];

        let dateSuffix = new Date().toISOString().replace(/:/g, '-');

        let degreeScanURL= await uploadDocument(degreeScan,`${employee.employeeId}-${req.body.qualification}-degreeCert-${dateSuffix}`,req.files['degreeScan'][0].buffer)

        let marksheetScanURL = await uploadDocument(marksheetScan,`${employee.employeeId}-${req.body.qualification}-marksheet-${dateSuffix}`, req.files['marksheetScan'][0].buffer)


        let educationalDetails = {
            qualification:req.body.qualification,
            schoolInstitute: req.body.schoolInstitute,
            universityBoard: req.body.universityBoard,
            score: req.body.score,
            scoreType: req.body.scoreType,
            yearOfPassing: req.body.yearOfPassing,
            city: req.body.city,
            State: req.body.State,
            country: req.body.country,
            degreeScan: degreeScanURL,
            marksheetScan: marksheetScanURL,
            courseType:req.body.courseType
        }

        const updateEmployee = await Employee.findOneAndUpdate({ employeeId: req.body.employeeId }, { $push: { educationalDetails: educationalDetails } }, { new: true })

        if(!updateEmployee){
            throw new Error ("Cannot add education details to employee")
        }

        return res.status(200).json({
            status: true,
            message: "Qualification Added Successfully",
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

        if (fileType ==="pdf") {

            console.log("OK")

        }
        else {
            throw new Error('Only PDF allowed')
        }

        const filee = buffer;
        let fullFileName =`${documentName}.${fileType}`;
        const fileName = `eduDocs/` + fullFileName;

        const url = await FileUpload.upload(filee,fileName);
        if(!url){throw new Error("Error in Uploading Document")}
        
        return url;

    } 
    catch (err) {
        throw new Error(err.toString());
    }
}