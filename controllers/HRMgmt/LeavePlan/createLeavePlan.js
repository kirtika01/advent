const Counter = require('../../../models/Counter')
const LeavePlan = require("../../../models/HRMgmt/LeavePlan")

exports.createLeavePlan = async (req, res, next) => {
    let flag = 0;
    try {

        let leaveplanExists = await LeavePlan.findOne({ leavePlanName: req.body.leavePlanName })
        console.log(leaveplanExists)
        if (leaveplanExists) {
            throw new Error("Leave plan already exists")
        }
        var counter = await Counter.findOneAndUpdate({ identifierName: "LeavePlan" }, { $inc: { count: 1 } }, { upsert: true, new: true })

        const leavePlanId = "LPLAN-" + counter.count;
        var leavePlan = new LeavePlan(req.body)
        leavePlan.leavePlanId = leavePlanId;

        const result = await leavePlan.save()
        if (result) {
            return res.status(200).json({
                status: true,
                message: "Leave Plan Created Successfully",
                leavePlan: result,
                leavePlanId: result.leavePlanId
            })
        } else {
            flag = 1
            throw new Error("Unable to create Leave Plan")
        }
    }
    catch (err) {
        if (flag) {
            var counter = await Counter.findOneAndUpdate({ identifierName: "LeavePlan" }, { $inc: { count: -1 } }, { upsert: true, returnNewDocument: true })
        }
        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }
}