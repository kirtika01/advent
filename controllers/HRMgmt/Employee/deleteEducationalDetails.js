const Employee = require('../../../models/HRMgmt/Employee');
//const FileUpload = require('../../Utils/AwsSingleUpload');
const FileDelete = require('../../Utils/AwsSingleDelete');
const { ObjectId } = require('bson');

exports.deleteEducationalDetails = async (req, res) => {
    try {
        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error("Employee Not Found")
        }

        
        const employeeEduDetail = await Employee.aggregate([
            { $match: { employeeId: req.body.employeeId } },
            {
                $project: {
                    educationalDetails: {
                        $filter: {
                            input: "$educationalDetails",
                            as: "eduDetail",
                            cond: { $eq: ["$$eduDetail._id",ObjectId.createFromHexString(req.body.id) ] }
                        }
                    }
                }
            }
        ]);

        
        const retrievedEducationDetail = employeeEduDetail[0].educationalDetails[0];

        console.log(retrievedEducationDetail)

        if(retrievedEducationDetail==null){
            throw new Error("Details with the provided objectId does not exist")
        }
        

        await deleteDocument(retrievedEducationDetail.degreeScan)
        await deleteDocument(retrievedEducationDetail.marksheetScan)

        const updateEmployee = await Employee.findOneAndUpdate(
            { employeeId: req.body.employeeId },
            { $pull: { educationalDetails: { _id:ObjectId.createFromHexString(req.body.id)} } },
            { new: true }
        );

        if(!updateEmployee){
            throw new Error ("Cannot delete the document")
        }

        return res.status(200).json({
            status: true,
            message: "Document deleted Successfully",
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

async function deleteDocument(File) {
    try {

        
        let fileName = await File.split(process.env.AWS_BUCKET_URL)[1]
        console.log("This is ::"+fileName)
        
        let deleted = await FileDelete.delete(fileName);

        return;
    }
    catch(err){
       throw new Error ("Cannot delete from AWS")
    }
}