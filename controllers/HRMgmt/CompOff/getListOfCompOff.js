const CompOff = require('../../../models/HRMgmt/CompOff');

exports.getListOfCompOff = async (req, res) => {
    try {

        const raisedByEmpId = req.query.raisedByEmpId;
        const compOffStatus = req.query.compOffStatus;
        const linManagerId = req.query.linManagerId;

        let query = {}

        if (raisedByEmpId) {
            query["raisedByEmpId"] = raisedByEmpId
        }
        if (compOffStatus) {
            query["compOffStatus"] = compOffStatus
        }
        if (linManagerId) {
            query["lineManagerEmpId"] = lineManagerEmpId
        }

        let compOffList;

        if (Object.keys(query).length === 0) {

            compOffList = await CompOff.find()

        }
        else {

            compOffList = await CompOff.find(query)

        }

        if (compOffList.length > 0) {

            return res.status(200).json({
                status: true,
                compOffList: compOffList
            })

        }
        else {

            return res.status(200).json({
                status: false,
                Message: "No CompOff available"
            })

        }


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}