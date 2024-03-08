const Leave = require("../../../models/HRMgmt/Leave")
const FileUpload = require('../../Utils/AwsSingleUpload');


exports.uploadSupportingDocument = async (req, res) => {
    try {
        let leave = await Leave.findOne({ leaveId: req.body.leaveId })

        if (!leave) {
            throw new Error(`Cannot find leave with leaveId - ${req.body.leaveId}`)
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

        const filee = req.file.buffer;
        let fullFileName = `${req.body.leaveId}.${fileType}`;
        const fileName = `leaveSupportingDocument/` + fullFileName;

        const url = await FileUpload.upload(filee, fileName);
        if (!url) {
            throw new Error("Error in Uploading leave Document")
        }


        leave.supportingDocument = url
        leave.supportingDocumentComment = req.body.supportingDocumentComment

        let doc = await leave.save()

        if(!doc){
            throw new Error (`Cannot add leave documents`)
        }

        res.status(200).json({
            status: true,
            message: "leave document added successfully",
            leave: doc
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}