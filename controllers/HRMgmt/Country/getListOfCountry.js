const Country = require("../../../models/HRMgmt/Country");

exports.getListOfCountry = async (req, res) => {

	try {

		const countries = await Country.find({})

		if (countries) {

			return res.status(200).json({
				status: true,
				countries: countries
			})
		}
		else {
			throw new Error("Unable to find Countries")
		}
	}

	catch (err) {

		console.log(err)
		res.status(500).json({
			status: false,
			message: err.toString()
		})

	}
}