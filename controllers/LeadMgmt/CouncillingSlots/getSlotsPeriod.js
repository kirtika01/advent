const Slot = require('../../../models/LeadMgmt/CouncillingSlots');

exports.getSlotsPeriod = async (req, res) => {
	try{
		let query ={}

		query.branchCode = req.query.branchCode;
		
		let slotDateStart = new Date(req.query.slotDateStart);
        let slotDateEnd = new Date(req.query.slotDateEnd);
		let slotStatus = req.query.slotStatus;

		let slots;

		if(slotStatus=="All"){

			slots = await Slot.aggregate([
				{$match: {branchCode: query.branchCode,slotDate: {$gte: slotDateStart,$lte: slotDateEnd}}},
				{$group: {_id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$slotDate" } } },count: { $sum: 1 }}},
				{$sort: { "_id.date": 1 }}
			]);
		}
		else{
			slots = await Slot.aggregate([
				{$match: {branchCode: query.branchCode,slotDate: {$gte: slotDateStart,$lte: slotDateEnd},slotStatus:slotStatus}},
				{$group: {_id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$slotDate" } } },count: { $sum: 1 }}},
				{$sort: { "_id.date": 1 }}
			]);

		}


		if(slots.length == 0){
			throw new Error("Slots not found")
		}
        return res.status(200).json({
			status: true,
			slotDateStart: slotDateStart.toISOString().split('T')[0],
			slotDateEnd: slotDateEnd.toISOString().split('T')[0],
			branchCode: query.branchCode,
			branchName: req.query.branchName, 
			noOfDays:Math.round((slotDateEnd - slotDateStart) / (1000 * 60 * 60 * 24)) + 1,
			Slots: slots
		})
	}
	catch(err){
		console.log(err)
		return res.status(500).json({
			status: false,
			error: err.toString()
		})
	}
}




