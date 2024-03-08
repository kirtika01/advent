const Claims = require('../../../models/HRMgmt/Claims');

exports.claimsCountMonth = async (req, res) => {

    try {

        let currMonth = new Date().getMonth();
        let currYear = new Date().getFullYear();

        let noOfDays = new Date(currYear, currMonth, 0).getDate();

        //console.log(noOfDays);
        //console.log(new Date(currYear, currMonth, noOfDays))
        //console.log(new Date(new Date(currYear , currMonth , 2).setUTCHours(0, 0, 0, 0)))
        //console.log(new Date(new Date(currYear , currMonth  , noOfDays).setUTCHours(23, 59, 59, 999)))

        let matchOperator = {
            raisedByEmpId : req.params.raisedByEmpId,
            $and: [
                {
                    appliedDate: { $gte: new Date(new Date(currYear, currMonth, 2).setUTCHours(0, 0, 0, 0)) }
                },
                {
                    appliedDate: { $lte: new Date(new Date(currYear, currMonth, noOfDays).setUTCHours(23, 59, 59, 999)) }
                }
            ]

        }

        //console.log(matchOperator)

        let claimsList = await Claims.aggregate([
            {
                $match: matchOperator
            }
        ])

        if (claimsList.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No Claims found this month"
            })
        } else {
            return res.status(200).json({
                status: true,
                claimsList,
                length : claimsList.length
            })
        }


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            sttaus: false,
            error: err.toString()
        })
    }
}