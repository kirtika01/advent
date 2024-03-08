const LeavePlan = require("../../../models/HRMgmt/LeavePlan")

exports.toggleActiveLeavePlan = async (req, res, next) => {
   
    try {

        const leavePlan = await LeavePlan.findOne({ leavePlanId: req.params.leavePlanId })
        if (!leavePlan) {
            throw new Error("Leave Plan not found")
        }
        leavePlan.isActive = !leavePlan.isActive
        const result = await leavePlan.save()
        if (result) {
            return res.status(200).json({
                status: true,
                message: "Leave Plan Updated Successfully",
                leavePlan: result
            })
        } else {
            throw new Error("Unable to update Leave Plan")
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }
}