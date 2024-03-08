
const Slot = require('../../../models/LeadMgmt/CouncillingSlots');

exports.bookSlots = async (req, res) => {
    try{
        const slot = await Slot.findOne({slotId: req.body.slotId})

        if(!slot){
            return res.status(200).json({
                status: false,
                message: "Slot not found"
            })
        }
        let currentDate = new Date();
        const [slotEnd, modifier] = slot.slotEndTime.split(' ');

        // Get slot end time
        let [hours, minutes] = slotEnd.split(':');

         // Convert to 24-hour format
         if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        // Create new date object for slot end time
        //let slotEndDate = new Date();

        //slotEndDate.setHours(hours, minutes);

        if(slot.isExpired==true){
            throw new Error("Slot Expired")
        }
        else{
            slot.slotBookingType = (req.body.slotBookingType == null) ? "NA" : req.body.slotBookingType
            slot.slotBookerFor = (req.body.slotBookerFor == null) ? "NA" :  req.body.slotBookerFor
            slot.slotBookerId = (req.body.slotBookerId == null) ? "NA" :  req.body.slotBookerId
            slot.slotBookerFullName = (req.body.slotBookerFullName == null) ? "NA" :  req.body.slotBookerFullName
            slot.slotBookedOn = new Date()
            slot.slotBookedFrom = (req.body.slotBookedFrom == null) ? "NA" :  req.body.slotBookedFrom
            slot.slotStatus="Booked"

            let doc = await slot.save();

            if(doc){
                return res.status(200).json({
                    status: true,
                    message: "Slot booked successfully",
                    Slot: doc
                })
            }
            else{
                throw new Error("Could not book slot")
            }
        }

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}




