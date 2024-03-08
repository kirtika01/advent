const Slot = require('../../../models/LeadMgmt/CouncillingSlots');
const Employee = require('../../../models/HRMgmt/Employee');

exports.assignSlot = async (req, res) => {
    try{
        const employee = await Employee.findOne({employeeId: req.body.slotAssignedTo})
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
        else if(slot.slotStatus!=="Booked"){
            return res.status(200).json({
                status: false,
                message: "Slot not Booked yet"
            })
        }

        else{
            const updateSlot = await Slot.findOneAndUpdate({slotId: req.body.slotId}, { $set: {
                slotAssignedTo: req.body.slotAssignedTo,
                slotAssignedToFullName:employee.employeeFullName,
                slotAgenda: req.body.slotAgenda,
                slotMeetingLink: "MeetingLink",
                slotStatus:"Assigned"
            }}, {new: true})

            if(updateSlot){
                return res.status(200).json({
                    status: true,
                    message: "Slot Assigned successfully",
                    Slot: updateSlot
                })
            }
            else{
                throw new Error("Could not assign slot")
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
