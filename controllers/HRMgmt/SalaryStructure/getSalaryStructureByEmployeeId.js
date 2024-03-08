const SalaryStructure = require("../../../models/HRMgmt/SalaryStructure");

exports.getSalaryStructureByEmployeeId = async (req, res) => {
    try {

        let salaryStructure

        if (req.query.finYear) {
            salaryStructure = await SalaryStructure.findOne({ employeeId: req.query.employeeId, finYear: req.query.finYear })
        }

        else {
            salaryStructure = await SalaryStructure.find({ employeeId: req.query.employeeId })
        }

        if (salaryStructure) {
            return res.status(200).json({
                status: true,
                salaryStructure: salaryStructure
            })
        }

        return res.status(200).json({
            status: false,
            message: "No salaryStructure found"
        })

    }
    catch (err) {
        res.status(500).json({
            status: false,
            error: err.toString()
        })

    }
}