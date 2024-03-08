const Lead = require("../../models/Lead");

exports.updateLeadByLeadId = async (req, res) => {
    try {
        const lead = await Lead.findOne({ leadId: req.body.leadId })

        if (lead) {

            const updateLead=await Lead.findOneAndUpdate({leadId:req.body.leadId},req.body.update,{new:true})
            if(updateLead){
                return res.status(200).json({
                    status: true,
                    message: "Lead successfully updated",
                    leadId:req.body.leadId,
                    Result:updateLead,
                })
            }else{
                return res.status(200).json({
                    status:false,
                    message: "Unable to update Lead",
                    lead :  updateLead
                })

            } 
        }
        else {

            throw new Error(`Lead ${req.body.leadId} does not exist.`)
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