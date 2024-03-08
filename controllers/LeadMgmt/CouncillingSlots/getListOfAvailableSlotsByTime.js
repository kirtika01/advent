const Slot = require('../../../models/LeadMgmt/CouncillingSlots');

exports.getListOfAvailableSlotsByTime = async (req, res) => {
    try {

        //{slotDate: {"$gte": new Date("2020-06-05"), "$lt": new Date("2020-06-06")} make the dates dynamic from req.query.slotDate +1
        let slotDate = new Date(req.query.slotDate);
        let nextDay = new Date(slotDate);
        nextDay.setDate(slotDate.getDate() + 1);


        let slots = await Slot.find({
            slotDate: { "$gte": slotDate,"$lt": nextDay}, 
            slotStatus: "Available",
            slotStartTime: req.query.slotStartTime, 
            slotEndTime: req.query.slotEndTime
        })

        if (slots.length == 0) {
            throw new Error("No slots found")
        }



        return res.status(200).json({
            status: true,
            message: "Slots found",
            slotDate: slots[0].slotDate,
            slotDay: slots[0].slotDay,
            slotStartTime: slots[0].slotStartTime,
            slotEndTime: slots[0].slotEndTime,
            slotDuration: slots[0].slotDuration,
            availableSlots: slots.length,
            slot: slots[0]
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