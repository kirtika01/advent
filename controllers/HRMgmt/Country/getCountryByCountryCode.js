const Country = require("../../../models/HRMgmt/Country");

exports.getCountryByCountryCode = async (req, res) => {

	try{

		let country = await Country.findOne({countryCode:req.params.countryCode})

		if(country){

			return res.status(200).json({
				status:true,
				country:country
			})
		}
		else{
			throw new Error("Unable to find Country")
		}

	}
	
	catch(err){

		console.log(err)
		res.status(500).json({
			status:false,
			message:err.toString()
		})

	}
}