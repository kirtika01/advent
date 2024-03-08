const Lead = require('../../../models/LeadMgmt/Lead');

exports.checkExisitingLead = async (req, res) => {
    try {

        let existFlag = false;
        let phoneFlag = false;
        let emailFlag = false;

        let oldLead

        let checkLeadPhone = await Lead.findOne({ leadPhoneNo: req.body.leadPhoneNo })

        if (checkLeadPhone) {
            existFlag = true;
            phoneFlag = true;
            oldLead = checkLeadPhone
        }

        let checkLeadEmail = await Lead.findOne({ leadEmail: req.body.leadEmail })

        if (checkLeadEmail) {
            existFlag = true;
            emailFlag = true;
            oldLead = checkLeadEmail
        }

        if (existFlag===true) {
            return res.status(200).json({
                message: "Lead Already Exists",
                existFlag: existFlag,
                phoneFlag: phoneFlag,
                emailFlag: emailFlag,
                status:oldLead.leadStatus,
                oldLead:oldLead
            })
        }
        
        return res.status(200).json({
            message: "Fresh Lead",
            existFlag:existFlag,
            phoneFlag: phoneFlag,
            emailFlag: emailFlag,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}