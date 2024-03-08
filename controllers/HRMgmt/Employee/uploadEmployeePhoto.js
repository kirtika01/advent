const Employee = require("../../../models/HRMgmt/Employee")
const FileUpload = require('../../Utils/AwsSingleUpload');
const FileDelete = require('../../Utils/AwsSingleDelete');


exports.uploadEmployeePhoto = async (req, res) => {
    try{
        let employee = await Employee.findOne({employeeId: req.body.employeeId});

        if(!employee){
            return res.status(200).json({
                status: false,
                message: "Employee not found"
            })
        }
        else{
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
    
            if (fileType === "png" || fileType === "PNG" || fileType === "JPG"|| fileType === "jpg" || fileType === "JPEG"|| fileType === "jpeg") {
    
                console.log("OK")
    
            }
            else {
                throw new Error('Only PNG, JPG, JPEG allowed')
            }

            if(employee.employeeDisplayPhoto){
                //need to send information to delete the file from s3
                let fileName = employee.employeeDisplayPhoto.split('/');
                fileName = fileName[fileName.length - 1];
                console.log(fileName);
                let deleted = await FileDelete.delete(fileName);
            }

            let fullFileName =`${req.body.employeeId}.${fileType}`;

            const filee = req.file.buffer;
            const fileName = `EmployeePhoto/` + fullFileName;
    
            const url = await FileUpload.upload(filee,fileName);

            if(!url){
                throw new Error("Error in Uploading Employee Photo")
            }

            employee.employeeDisplayPhoto = url;

            let doc =await employee.save();


            if(doc){
                return res.status(200).json({
                    status: true,
                    message: "Employee Photo Uploaded Successfully",
                    employee: doc
                })
            }
            else{
                return res.status(200).json({
                    status: false,
                    message: "Unable to upload Employee Photo"
                })
            }
        } 

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}



       