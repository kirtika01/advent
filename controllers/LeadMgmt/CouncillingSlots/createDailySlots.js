const logger = require('../../../batchJobs/LeadMgmt/createSlot.logger');
const axios = require('axios');

exports.createDailySlots = async (req, res) => {
	try{
		const slotsarray = req.body.slots;

		for(let i=0;i<slotsarray.length;i++){
			for(let j=0;j<slotsarray[i].slotCount;j++){

				if (!validateTimeFormat(slotsarray[i].slotStartTime) || !validateTimeFormat(slotsarray[i].slotEndTime)) {
					throw new Error("Invalid time format. Please provide time in 'HH:MM AM/PM' format.");
				}

				let url = process.env.URL + '/api/v1/leadmgmt/councillingSlots/createNewSlot';
				let slot = await axios.post(url, {
					slotDate: req.body.slotDate,
					slotDay: req.body.slotDay,
					slotStartTime: slotsarray[i].slotStartTime,
					slotEndTime: slotsarray[i].slotEndTime,
					slotDuration: slotsarray[i].slotDuration,
					slotCreatedBy: req.body.slotCreatedBy,
					branchCode: req.body.branchCode
				})
				if (slot) {
					logger.createSlotLogger.log('info', 'Slot Created For ' + req.body.slotDate)
				} else {
					logger.createSlotLogger.log('error', 'Unable to Create Slot')
				}
			}
		}
		return res.status(200).json({
			status: true,
			message: "Slots created successfully"
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
function validateTimeFormat(time) {
    const timeFormat = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    return timeFormat.test(time);
}
