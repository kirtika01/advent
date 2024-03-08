const Lead = require("../../models/Lead");
const User = require("../../models/User");
const admin = require("firebase-admin");

exports.assignLead = async (req, res) => {
    try {
        const { leadId, assignedBy, assignedByFullName, assigneeUserName } = req.body;
        

        const lead = await Lead.findOne({ leadId: req.body.leadId })

        if (!lead) {
            return res.status(200).json({
                status: false,
                message: "No Lead found for Lead ID :: " + req.body.leadId
            })
        }

        const user = await User.findOne({ userName: req.body.assigneeUserName });

        if (!user) {
            return res.status(200).json({
                status: true,
                message: "User is not available - " + req.body.assigneeUserName,
            })
        }

        let assigneeUserFullName = user.userFirstName;
        if (user.userMiddleName) { assigneeUserFullName += " " + user.userMiddleName };
        assigneeUserFullName += " " + user.userLastName;


        lead.assignedBy = assignedBy;
        lead.assignedByFullName = assignedByFullName;
        lead.assigneeUserName = assigneeUserName;
        lead.assigneeUserFullName = assigneeUserFullName;


        // let body;
        // let title;

        // title = `${lead.leadId} Accepted By ${assignedBy}`;
        // body = 'Assigned Notification'


        let doc = await lead.save();

        if (!doc) {
            throw new Error(
                "Unable to Assign the Lead"
            )
        }

        else {

            return res.status(200).json({
                status: true,
                message: "Lead Assigned",
                Lead: doc
            })
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