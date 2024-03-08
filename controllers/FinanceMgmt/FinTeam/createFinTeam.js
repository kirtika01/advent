const Finteam = require('../../../models/FinanceMgmt/FinTeam')
const Country = require('../../../models/HRMgmt/Country')

exports.createFinTeam = async (req, res) => {

	try {

		let finTeamCode = "FIN-" + req.body.countryCode + "-" + req.body.branchCode
		let finTeamCheck = await Finteam.findOne({ finTeamCode: finTeamCode })

		if (finTeamCheck) {
			throw new Error("FinTeam Already Exists")
		}


		let country = await Country.findOne({ countryCode: req.body.countryCode })

		if (!country) {
			throw new Error("Country Not Found")
		}


		let finTeam = new Finteam(req.body)
		finTeam.finTeamCode = finTeamCode
		finTeam.countryName = country.countryName
		finTeam.countryCurrency = country.countryCurrency
		finTeam.countryCode = country.countryCode

		let doc = await finTeam.save()

		if (doc) {

			return res.status(200).json({
				status: true,
				message: "FinTeam Created Successfully",
				finTeam: doc
			})

		}


	}
	catch (err) {
		// console.log(err)
		res.status(500).json({
			status: false,
			error: err.toString()
		})
	}
}