const Attendance = require('../../../models/HRMgmt/Attendance');

exports.getAttendanceReportEmployee = async (req, res) => {
    try {

        let matchOperator = {
            employeeId: req.query.employeeId
        }

        if (req.query.month && !req.query.year) {
            let month = req.query.month;
            let year;
            if (req.query.year) {
                year = req.query.year;
            } else {
                year = new Date().getFullYear();
            }

            matchOperator = {
                ...matchOperator,
                $and: [
                    {
                        approvalDate: { $gte: new Date(new Date(year, month - 1, 2).setHours(0, 0, 0, 0)) }
                    },
                    {
                        approvalDate: { $lte: new Date(new Date(year, month, 1).setHours(23, 59, 59, 999)) }
                    }
                ]
            }
        }

        else if (req.query.year && !req.query.month) {

            let year = req.query.year;
            let month = new Date().getMonth() + 1;
            let endDate = new Date().getDate();

            if (req.query.month) {
                startMonth = req.query.month;
                endMonth = req.query.month;
                endDate = 1;
            }

            matchOperator = {
                ...matchOperator,
                $and: [
                    {
                        approvalDate: { $gte: new Date(new Date(year, month - 1, 2).setHours(0, 0, 0, 0)) }
                    },
                    {
                        approvalDate: { $lte: new Date(new Date(year, month, endDate).setHours(23, 59, 59, 999)) }
                    }
                ]
            }

        }

        else if (req.query.year && req.query.month) {

            matchOperator = {
                ...matchOperator,
                $and: [
                    {
                        approvalDate: { $gte: new Date(new Date(req.query.year, req.query.month - 1, 2).setHours(0, 0, 0, 0)) }
                    },
                    {
                        approvalDate: { $lte: new Date(new Date(req.query.year, req.query.month, 1).setHours(23, 59, 59, 999)) }
                    }
                ]
            }

        }

        else if (req.query.currentMonth === true) {
            let year = req.query.year;
            let month = new Date().getMonth() + 1;
            let endDate = new Date().getDate();

            matchOperator = {
                ...matchOperator,
                $and: [
                    {
                        approvalDate: { $gte: new Date(new Date(year, month - 1, 2).setHours(0, 0, 0, 0)) }
                    },
                    {
                        approvalDate: { $lte: new Date(new Date(year, month, endDate).setHours(23, 59, 59, 999)) }
                    }
                ]
            }
        }

        let attendanceData = await Attendance.aggregate([
            {
                $match: matchOperator
            },
            {
                $group: { _id: '$attendanceType', count: { $sum: 1 } }
            }
        ])

       
        if (attendanceData.length === 0) {
            return res.status(200).json({
                status: false,
                message: 'No Data found'
            })
        }

        let fw = 0;
        let wfh = 0;
        let inOffice = 0;
        let leave = 0;

        attendanceData.forEach((att) => {
            if (att._id === 'FieldWork') {
                fw = att.count;
            } else if (att._id === 'WFH') {
                wfh = att.count;
            } else if (att._id === 'InOffice') {
                inOffice = att.count;
            } else if (att._id === 'Leave') {
                leave = att.count;
            }
        })

        return res.status(200).json({
            status: true,
            fieldWork: fw,
            wfh: wfh,
            inOffice: inOffice,
            leave: leave
        })

    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err
        });
    }
}