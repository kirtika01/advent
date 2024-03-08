const Lead = require('../../../models/LeadMgmt/Lead');

exports.getListOfLeadsToday = async (req, res) => {

    try {


        //Code to find leads generated today

        let matchOperator = {
            creationDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999))
            }
        };
        
        const leadsCreatedToday = await Lead.aggregate([
            {
                $match: matchOperator
            }
        ]);


        if (leadsCreatedToday.length > 0) {
            return res.status(200).json({
                status: true,
                No_of_Leads: leadsCreatedToday.length,
                leads: leadsCreatedToday

            })
        }
        return res.status(200).json({
            status: false,
            message: 'No Available Leads for today',

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