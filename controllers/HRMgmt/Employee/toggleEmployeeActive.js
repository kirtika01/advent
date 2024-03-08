const Employee= require("../../../models/HRMgmt/Employee");

exports.toggleEmployeeActive = async (req, res) => {
    try {
        console.log(req.body.employeeId)
        const employee=await Employee.findOneAndUpdate({employeeId:req.body.employeeId},[{"$set": {isActive: {"$not": "$isActive"}}}],{new:true})

        if (!employee) {
            throw new Error(
                "Employee Not Found"
            )
        }
        else {
            return res.status(200).json({
                status: true,
                message: "Updated",
                Employee: employee
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}