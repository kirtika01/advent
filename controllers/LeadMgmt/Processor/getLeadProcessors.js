const Lead = require("../../../models/LeadMgmt/Lead");
const Employee = require("../../../models/HRMgmt/Employee");


exports.getLeadProcessors = async (req, res) => {
    try{
        const lead = await Lead.findOne({ leadId: req.params.leadId })

        if(!lead){
            throw new Error("Lead not found")
        }

        const processors = await Lead.aggregate([
            { $match: { leadId: req.params.leadId } },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'counsellorAssigned',
                    foreignField: '_id',
                    as: 'counsellorAssigned'
                },
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'sseAssigned',
                    foreignField: '_id',
                    as: 'sseAssigned'
                },
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'processExecutiveAssigned',
                    foreignField: '_id',
                    as: 'processExecutiveAssigned'
                },
            },
            {
                $lookup: {
                    from: 'squads',
                    localField: 'studentSupportSquad',
                    foreignField: '_id',
                    as: 'studentSupportSquad'
                },
            },
            {
                $lookup: {
                    from: 'squads',
                    localField: 'processSupportSquad',
                    foreignField: '_id',
                    as: 'processSupportSquad'
                }
            }
        ])
        //console.log(processors[0])
        return res.status(200).json({
            status: true,
            message: "List of processors assigned to this Lead",
            leadId: req.params.leadId,
            counsellorAssigned:processors[0].counsellorAssigned,
            sseAssigned:processors[0].sseAssigned,
            processExecutiveAssigned:processors[0].processExecutiveAssigned,
            studentSupportSquad:processors[0].studentSupportSquad,
            processSupportSquad:processors[0].processSupportSquad
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