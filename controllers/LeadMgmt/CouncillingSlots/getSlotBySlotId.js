const Slot = require('../../../models/LeadMgmt/CouncillingSlots');

exports.getSlotBySlotId = async (req, res) => {
    try {
        const slot = await Slot.findOne({ slotId: req.params.slotId });
        if (slot) {
            return res.status(200).json({
                status: true,
                message: "Slot found for slotId  - " + req.params.slotId ,
                Slot: slot
            })
        }
        else {
            return res.status(200).json({
                status: false,
                message: "Slot not found"
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}