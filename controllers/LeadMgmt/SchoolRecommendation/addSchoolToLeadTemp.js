const Lead = require("../../../models/LeadMgmt/Lead");

exports.addSchoolToLeadTemp = async (req, res) => {
    try {

        let lead = Lead.findOne({ leadId: req.body.leadId });

        if (!lead) {
            throw new Error(`No Lead found for Lead ID ${req.body.leadId}`)
        }

        lead.schoolRecommendation = lead.schoolRecommendation.push({
            school: req.body.school,
            course: req.body.course,
            campus: req.body.campus,
        })

        let doc = await lead.save();

        if (doc) {
            return res.status(200).json({
                status: true,
                message: "School Added Succesfully",
                Lead: doc
            })
        } else {
            throw new Error("Unable to Add School")
        }



    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}