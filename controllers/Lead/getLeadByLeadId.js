const Lead =require("../../models/Lead");

exports.getLeadByLeadId = async (req, res) => {
    try {

        const result = await Lead.findOne({ leadId: req.params.leadId })
        if (result) {
            return res.status(200).json({
                status: true,
                lead: result
            })
        } else {
            return res.status(200).json({
                status: false,
                message: "No Lead found for Lead ID :: " + req.params.leadId
            })
        }


    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}