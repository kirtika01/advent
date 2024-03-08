const Slot = require('../../../models/LeadMgmt/CouncillingSlots');

exports.getDailySlotsCount = async (req, res) => {
	try {
		let query = {}

		let slotDate = new Date(req.query.slotDate);
		let nextDay = new Date(slotDate);
        nextDay.setDate(slotDate.getDate() + 1);

		const slots = await Slot.aggregate([
			{
				$match: {
					branchCode: req.query.branchCode,
					slotDate: { $gte: slotDate, $lte: nextDay },
					slotStatus: "Available"
				}
			},
			{
                $group: {
                    _id: "$slotStartTime",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
					count: 1,
                    slotStartTime: '$_id'
                }
            }
		]);

		
		if (slots.length == 0) {
			throw new Error("Slots not found")
		}
		return res.status(200).json({
			status: true,
			slotDate: req.query.slotDate,
			Slots: slots
		})
	}
	catch (err) {
		console.log(err)
		return res.status(500).json({
			status: false,
			error: err.toString()
		})
	}
}



/*
branchCode=BRNCH-51&slotDate=2020-06-05&slotStatus = Available

group by slotStartTime and send count

{
	slotDate: "2020-06-05",
	slotCounts:[
		{
			slotStartTime: "10:00 AM",
			count: 5
		}
		{
			slotStartTime: "11:00 AM",
			count: 2
		}


	}]
}
*/



