const Slot = require('../../../models/LeadMgmt/CouncillingSlots');
const Employee = require('../../../models/HRMgmt/Employee');
const Branch = require('../../../models/HRMgmt/Branch');
const Counter = require('../../../models/Counter');

exports.createNewSlot = async (req, res) => {
    try{
        const employee = await Employee.findOne({employeeId:req.body.slotCreatedBy})
        const branch = await Branch.findOne({branchCode:req.body.branchCode})

        
        if (!validateTimeFormat(req.body.slotStartTime) || !validateTimeFormat(req.body.slotEndTime)) {
            throw new Error("Invalid time format. Please provide time in 'HH:MM AM/PM' format.");
        }
        const slotDate = new Date(req.body.slotDate);
        const [time, modifier] = req.body.slotStartTime.split(' ');
        let [hours, minutes] = time.split(':');

        // Convert to 24-hour format
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        // Set the hours and minutes of slotDate
        slotDate.setHours(hours, minutes);

        if(!employee){
            return res.status(200).json({
                status: false,
                message: "Employee not found"
            })
        }
        if(!branch){
            return res.status(200).json({
                status: false,
                message: "Branch not found"
            })
        }
        const slot = new Slot(req.body);

        let counter = await Counter.findOneAndUpdate({ identifierName: "Slot" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        const slotId = "SLOT-" + counter.count;

        let slotAlreadyExists = await Slot.findOne({slotId: slotId})

        if(slotAlreadyExists){
            throw new Error("Slot already exists")
        }

        slot.slotId = slotId;
        slot.slotCreatedBy = employee.employeeId;
        slot.slotCreatedByFullName = employee.employeeFullName;
        slot.branchName = branch.branchName;
        slot.branchCode = branch.branchCode;
        slot.slotStatus = "Available";
        slot.slotDate = slotDate;

        let doc = await slot.save();

        if(doc){
            return res.status(200).json({
                status: true,
                message: "Slot created successfully",
                Slot: doc
            })
        }
        else{
            throw new Error("Could not create slot")
        }

    }
    catch(err){
        console.log(err)
        let counter = await Counter.findOneAndUpdate({ identifierName: "Slot" }, { $inc: { count: -1 } }, { upsert: true, new: true })
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