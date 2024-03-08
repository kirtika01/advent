const Branch = require("../../../models/HRMgmt/Branch");
const Employee = require("../../../models/HRMgmt/Employee")
const FinTeam = require("../../../models/FinanceMgmt/FinTeam")

exports.assignFinTeam = async (req, res) => {

	try {

		let finTeam = await FinTeam.findOne({ finTeamCode: req.body.finTeamCode })

		if (!finTeam) {
			throw new Error("FinTeam Not Found")
		}

		// let finAdmin = await Employee.findOne({ _id: finTeam.finTeamAdmin })

		// if (!finAdmin) {
		// 	throw new Error("FinTeam Admin Not Found")
		// }


		let employee = await Employee.findOne({ employeeId: req.body.employeeId })

		if (!employee) {
			throw new Error("Employee Admin Not Found")
		}

		finTeam.finTeamAdmin = employee
		finTeam.finTeamAdminName = employee?.employeeFullName

		let branch = await Branch.findOne({ branchCode: req.body.branchCode })

		if (!branch) {
			throw new Error("Unable to find Branch")
		}

		branch.finTeam = finTeam
		branch.finTeamName = finTeam.finTeamName
		branch.financeAdmin = employee

		let doc = await branch.save()

		let len = finTeam.branches.length
		finTeam.branches[len] = branch
		let doc2 = finTeam.save()

		if (doc && doc2) {

			return res.status(200).json({
				status: true,
				message: "FinTeam Assigned Successfully",
				finTeam: doc
			})

		}
		else {

			throw new Error("Unable to Assign FinTeam")

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