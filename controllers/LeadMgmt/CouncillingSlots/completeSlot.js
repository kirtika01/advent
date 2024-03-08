const Slot = require('../../../models/LeadMgmt/CouncillingSlots');
const Employee = require('../../../models/HRMgmt/Employee');

exports.completeSlot = async (req, res) => {
   try{
      const slot = await Slot.findOne({slotId: req.body.slotId})
      const employee = await Employee.findOne({employeeId: req.body.slotCompletedBy})

      if(!employee){
        return res.status(200).json({
            status: false,
            message: "Employee not found"
        })
    }


      if(!slot){
          return res.status(200).json({
              status: false,
              message: "Slot not found"
          })
      }
      else if(slot.slotAssignedTo != req.body.slotCompletedBy){
          return res.status(200).json({
              status: false,
              message: "Must be completed by the same employee who was assigned the slot"
          })
      }
      else{
          const updateSlot = await Slot.findOneAndUpdate({slotId: req.body.slotId}, 
            { $set: {slotCompletedOn: new Date(), slotStatus:"Completed",slotCompletedBy:req.body.slotCompletedBy,
            slotCompletedByFullname:employee.employeeFullName,
        
            }}, {new: true})

          if(updateSlot){
              return res.status(200).json({
                  status: true,
                  message: "Slot Completed successfully",
                  Slot: updateSlot
              })
          }
          else{
                throw new Error("Could not complete slot")
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
