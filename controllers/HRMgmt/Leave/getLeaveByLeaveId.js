const Leave = require("../../../models/HRMgmt/Leave")

exports.getLeaveByLeaveId = async (req, res) => {

    try {

        let id = req.params.leaveId;

        let doc = await Leave.findOne({ leaveId: id });

        if (doc) {
            return res.status(200).json({
                status: true,
                leave: doc
            })
        } else {
            throw new Error ('Leave - ' + id + ' not found')
        }



    }

    catch (err) {
        console.log(err)
        

        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}
