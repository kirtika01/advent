const Leave = require('../../../../models/HRMgmt/Leave');

exports.leaveCountByMonth = async (req, res) => {
    try {


        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;

        let result = {
            Applied: 0,
            Approved: 0,
            Rejected: 0,
            OpenRequest: 0,
            Cancelled : 0
        }

        //console.log(new Date(year, month - 1, 2).setUTCHours(0, 0, 0, 0))

        let leaveReport = await Leave.aggregate([
            {
                $match: {
                    $and: [
                        {
                            leaveStartDate: { $gte: new Date(new Date(year, month - 1, 2).setUTCHours(0, 0, 0, 0)) }
                        },
                        {
                            leaveStartDate: { $lte: new Date(new Date(year, month, 1).setUTCHours(23, 59, 59, 999)) }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: '$applicationStatus',
                    count: { $sum: 1 }
                }
            }
        ])

        //console.log(leaveReport)
        let total = 0;

        await leaveReport.reduce(async (promise, leave) => {
            await promise;

            if (result.hasOwnProperty(`${leave._id}`)) {
                result[`${leave._id}`] = leave.count
            }

            if(leave._id === 'Applied'){
                result['OpenRequest'] += leave.count
            }

            total += leave.count

        }, Promise.resolve())

        result.Applied = total;
        

        return res.status(200).json({
            status: true,
            leaveReport: result
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}