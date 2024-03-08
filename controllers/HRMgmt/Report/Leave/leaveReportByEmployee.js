const Leave = require('../../../../models/HRMgmt/Leave');

exports.leaveReportByEmployee = async (req, res, next) => {
    try {

        let query = {
            applicationStatus: 'Approved'
        };

        if (req.query.days) {
            query = {
                ...query,
                $and: [
                    {
                        leaveStartDate: {
                            $gte: new Date(new Date().setTime(new Date().getTime() - (req.query.days * 24 * 60 * 60 * 1000)))
                        }
                    },
                    {
                        leaveStartDate: {
                            $lte: new Date(new Date().setUTCHours(23, 59, 59, 999))
                        }
                    }
                ]
            }
        }

        if (req.query.employeeId) {
            query = {
                ...query,
                employeeId: req.query.employeeId
            }
        }

        //console.log(query);

        let leaveReport = await Leave.aggregate([
            {
                $match : query
            },
            {

                $group : {
                    _id : "$leaveType",
                    count : {$sum : '$noOfDays'}
                }

            }
        ]);

        return res.status(200).json({
            status: true,
            leaveReport: leaveReport
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}