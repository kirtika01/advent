const Leave = require('../../../../models/HRMgmt/Leave');

exports.monthwiseLeaveReport = async (req, res, next) => {
    try {

        let currMonth = new Date().getMonth() + 1;
        let month = new Date().getMonth() + 1;

        if (month === 12) month = 1;
        else month = month + 1;

        let year = new Date().getFullYear();
        if (currMonth < month) year = year - 1;

        let result = [];

        let monthArr = [];

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((val) => {

            let monthName = new Date(year, month - 1, 3).toLocaleString('en-US', {
                month: 'long',
            });

            monthArr.push([month, year, monthName,
                {
                    WeeklyOff: 0,
                    CasualLeave: 0,
                    MedicalLeave: 0,
                    EarnedLeave: 0,
                    LWP: 0,
                    total: 0
                }
            ]);

            if (month === 12) month = 1;
            else month = month + 1;

            if (month <= currMonth && year < new Date().getFullYear()) year = year + 1;

        })

        //console.log(monthArr, 'monthArr');

        await monthArr.reduce(async (promise, arr) => {

            await promise;

            let leaves = await Leave.aggregate([
                {
                    $match: {

                        applicationStatus: "Approved",
                        $and: [
                            {

                                leaveStartDate: { $gte: new Date(new Date(arr[1], arr[0] - 1, 2).setHours(0, 0, 0, 0)) }
                            },
                            {
                                leaveStartDate: { $lte: new Date(new Date(arr[1], arr[0], 1).setHours(23, 59, 59, 999)) }
                            }
                        ]
                    }
                },
                {
                    $group: { _id: '$leaveType', count: { $sum: '$noOfDays' } }
                },
            ])

            let obj = arr[3];
            let total = 0;

            await leaves.reduce(async (promise, leave) => {
                await promise;

                if (obj.hasOwnProperty(`${leave._id}`)) {
                    obj[`${leave._id}`] = leave.count;
                    total += leave.count;
                }

            }, Promise.resolve())

            obj.total = total;
            obj.year = arr[1];
            obj.month = arr[0];
            obj.monthName = arr[2];
            //console.log(obj);

            result.push(obj);


        }, Promise.resolve());

        //console.log(result);


        return res.status(200).json({
            status: true,
            monthwiseLeaveReport: result
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}