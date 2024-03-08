const Slot = require('../../../models/LeadMgmt/CouncillingSlots');
const Employee = require('../../../models/HRMgmt/Employee');

exports.cancelSlot = async (req, res) => {
    try{
        const employee = await Employee.findOne({employeeId: req.body.slotCancelledBy})
        const slot = await Slot.findOne({slotId: req.body.slotId})

        if(!employee){
            return res.status(200).json({
                status: false,
                message: "Employee not found"
            })
        }
        else if(!slot){
            return res.status(200).json({
                status: false,
                message: "Slot not found"
            })
        }
        else{
            const updateSlot = await Slot.findOneAndUpdate({slotId: req.body.slotId}, { $set: {
                slotCancelledOn: new Date(),
                slotCancelledBy: req.body.slotCancelledBy,
                slotCancelledByFullName:employee.employeeFullName,
                slotCancellationReason: req.body.slotCancellationReason,
                slotStatus:"Cancelled"
            }}, {new: true})

            if(updateSlot){
                return res.status(200).json({
                    status: true,
                    message: "Slot Cancelled successfully",
                    Slot: updateSlot
                })
            }
            else{
                throw new Error("Could not cancel slot")
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