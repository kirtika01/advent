const Lead = require('../../../models/LeadMgmt/Lead');

exports.getLeadQueueDetails = async (req, res) => {
    try {
        let query = {};

        query['creationDate'] = {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
        console.log(new Date(new Date().setHours(0, 0, 0, 0)))
        if (req.query.queueName) {
            query['queueName'] = req.query.queueName
        }
        let leadsCreatedToday = await Lead.aggregate([
            {
                $match: query
            }
        ]);

        const leadStatuses = [
            "New Lead",
            "Lead ReOpened",
            "Counsellor Assigned",
            "Calling In Progress",
            "Counselling In Progress",
            "Student Onboarded",
            "Lead Cancelled"
        ];
        let allStatuses = leadStatuses.map(status => ({ leadStatus: status, count: 0 }));

        let leadCountByQueueName = await Lead.aggregate([
            {
                $match:{
                    leadStatus: { $in: leadStatuses }
                }
            },
            {
                $group: { _id: "$leadStatus", count: { $sum: 1 } }
            },
            {
                $project: {
                    _id: 0,
                    leadStatus: "$_id",
                    count: {
                        $ifNull: ["$count", 0]
                    }
                }
            }
        ])

        if (req.query.queueName) {
            leadCountByQueueName = await Lead.aggregate([
                {
                    $match: {
                        queueName: req.query.queueName,
                    }
                },
                {
                    $group: { _id: "$leadStatus", count: { $sum: 1 } }
                },
                {
                    $project: {
                        _id: 0,
                        leadStatus: "$_id",
                        count: {
                            $ifNull: ["$count", 0]
                        }
                    }
                }
            ])
        }

        leadCountByQueueName = allStatuses.map(status => {
            const foundStatus = leadCountByQueueName.find(leadStatus => leadStatus.leadStatus === status.leadStatus);
            return foundStatus || status;
        });

        return res.status(200).json({
            status: true,
            leadsCreatedToday: leadsCreatedToday.length,
            leadCountByQueueName: leadCountByQueueName
        })


    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}
/*
await leadCountByQueueName.reduce(async (promise, lead) => {

            await promise;

            if (status.includes(lead._id)) {
                data.push({ leadLabel: lead._id, leadCount: lead.count })
                statusCovered.push(lead._id);
            }
        }, Promise.resolve());

        await status.reduce(async (promise, st) => {
            await promise;

            if (!(statusCovered.includes(st))) {
                data.push({ leadLabel: st, leadCount: 0 })
            }

        }, Promise.resolve())
*/