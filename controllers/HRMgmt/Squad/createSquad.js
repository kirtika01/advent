const Squad = require('../../../models/HRMgmt/Squad');
const FileUpload = require('../../Utils/AwsSingleUpload');


exports.createSquad = async (req, res) => {

	try {

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

		let squadCheck = await Squad.find({ $or: [{ squadCode: req.body.squadCode }, { squadName: req.body.squadName }] })

		if (squadCheck.length > 0) {
			throw new Error("Squad with this Code & Name  Already Exists")
		}



		let doc = await Squad.create(req.body)

		if (doc) {
			let fullFileName =`${req.body.squadCode}_${doc.squadName}.${fileType}`;

            const filee = req.file.buffer;
            const fileName = `SquadLogo/` + fullFileName;
    
            const url = await FileUpload.upload(filee,fileName);

			if(!url){
				throw new Error("Error in Uploading Squad Logo")
			}

			doc.squadLogo = url;
			await doc.save();

			return res.status(200).json({
				status: true,
				message: "Squad Created Successfully",
				squad: doc
			})

		}
		else {

			throw new Error("Unable to Create Squad")

		}

	}

	catch (err) {

		console.log(err)
		res.status(500).json({
			status: false,
			message: err.message
		})

	}

}

