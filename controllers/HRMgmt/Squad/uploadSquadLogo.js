const Squad = require('../../../models/HRMgmt/Squad');
const FileUpload = require('../../Utils/AwsSingleUpload');

exports.uploadSquadLogo = async (req, res) => {
    try{
        let squad = await Squad.findOne({squadCode: req.body.squadCode});

        if(!squad){
            return res.status(200).json({
                status: false,
                message: "Squad not found"
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
    
            if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
    
                console.log("OK")
    
            }
            else {
                throw new Error('Only PNG, JPG, JPEG allowed')
            }
            let fullFileName =`${req.body.squadCode}_${squad.squadName}.${fileType}`;

            const filee = req.file.buffer;
            const fileName = `SquadLogo/` + fullFileName;
    
            const url = await FileUpload.upload(filee,fileName);

			if(!url){
				throw new Error("Error in Uploading Squad Logo")
			}

			squad.squadLogo = url;
			let doc =await squad.save();

            if(doc){
                return res.status(200).json({
                    status: true,
                    message: "Squad Logo Uploaded Successfully",
                    squad: doc
                })
            }
            else{
                return res.status(200).json({
                    status: false,
                    message: "Squad Logo Not Uploaded Successfully"
                })
            }
        }
    }
    catch(err){
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}