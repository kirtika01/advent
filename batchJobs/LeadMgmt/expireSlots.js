var cron = require('node-cron');
const Slot = require('../../models/LeadMgmt/CouncillingSlots');

cron.schedule('*/5 * * * * *', async () => {
    try{
        console.log('ExpireSlots Job Initiated:::')
        
        let currentTime = new Date();
        let currentHours = currentTime.getHours();
        let currentMinutes = currentTime.getMinutes();

        // Pad hours and minutes with leading zeros if necessary
        if (currentHours < 10) currentHours = '0' + currentHours;
        if (currentMinutes < 10) currentMinutes = '0' + currentMinutes;

        let slots = await Slot.find({ isExpired: false });

        slots = slots.filter(slot => {
            let [slotHours, slotMinutes] = slot.slotStartTime.split(':');
            let slotTime = slot.slotDate;
            slotTime.setHours(slotHours, slotMinutes);
            return slotTime < currentTime;
        });

        if(slots.length > 0){
            await slots.reduce(async (promise, s) => {
                await promise;

                let slot = await Slot.findOne({slotId: s.slotId})
                slot.isExpired = true
                slot.slotStatus = 'Expired'

                let doc = await slot.save()

                if(doc){
                    console.log(`Slot - ${s.slotId} updated`)
                }
                else{
                    console.log(`Could not update Slot - ${s.slotId}`)
                }
            }, Promise.resolve())
        }
        console.log('ExpireSlots Job Terminated:::')
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})

