const Country = require("../../../models/HRMgmt/Country");
const Branch = require("../../../models/HRMgmt/Branch");

exports.assignBranchToCountry = async (req, res) => {

	try {

		console.log(req.body, 'body')

		var branch = await Branch.findOne({ branchCode: req.body.branchCode })

		if (!branch) {
			throw new Error("Branch Not Found")
		}

		var country = await Country.findOne({ countryCode: req.body.countryCode })

		if (!country) {
			throw new Error("Country Not Found")
		}

		// console.log(country, 'country/////////////////////')
		// console.log(branch, 'branch/////////////////////')
		// console.log(branch._id)
		let len = country.branches.length;
		country.branches[len] = branch;
		// console.log(country, 'country again /////////////')

		await country.save()

		branch.countryCode = country.countryCode

		await branch.save()

		return res.status(200).json({
			status: true,
			message: 'Branch Assigned to Country Successfully',
			country: country
		})

	}

	catch (err) {
		console.log(err.toString())
		res.status(500).json({
			status: false,
			message: err.toString()
		})
	}
}
