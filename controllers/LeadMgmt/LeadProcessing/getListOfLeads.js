const Lead = require("../../../models/LeadMgmt/Lead");

exports.getListOfLeads = async (req, res) => {
    try {

        let query = {};

        // if (req.query.counsellorEmpId) {
        //     query['telecallerEmpId'] = req.query.telecallerEmpId;
        // }
        // if (req.query.counsellorEmpId) {
        //     query['counsellorEmpId'] = req.query.counsellorEmpId;
        // }

        if (req.query.preferredCountry) {
            query['preferredCountry'] = req.query.preferredCountry;
        }

        if (req.query.queueName) {
            query['queueName'] = req.query.queueName;
        }
        if (req.query.leadStatus) {
            query['leadStatus'] = req.query.leadStatus;
        }
        if (req.query.leadSource) {
            query['leadSource'] = req.query.leadSource;
        }
        if (req.query.campaignId) {
            query['campaignId'] = req.query.campaignId;
        }
        if (req.query.purpose) {
            query['purpose'] = req.query.purpose;
        }

        if (req.query.isReopened) {
            query['isReopened'] = req.query.isReopened;
        }

        let list;

        let lookupForCounsellorAssigned = {
            $lookup: {
                from: 'employees',
                localField: 'counsellorAssigned',
                foreignField: '_id',
                as: 'counsellorAssigned'
            }
        }
        let lookupForStudentSupportSquad = {
            $lookup: {
                from: 'squads',
                localField: 'studentSupportSquad',
                foreignField: '_id',
                as: 'studentSupportSquad'
            }
        }

        let no_of_docs_each_page = req.query.pageSize;
        let current_page_number = req.query.pageNo;

        if(!req.query.pageNo){
            current_page_number = 0
        }
        if(!req.query.pageSize){
            no_of_docs_each_page =10
        }

        let totalNoOfLeads

        
        if (Object.keys(query).length > 0) {

            totalNoOfLeads = await Lead.find(query).count()

            if (req.query.lookup) {
                list = await Lead.aggregate([
                    { $match: query },
                    lookupForCounsellorAssigned,
                    lookupForStudentSupportSquad,
                    { $skip : no_of_docs_each_page * current_page_number }, 
                    { $limit : no_of_docs_each_page }
                ])
            }
            else list = await Lead.find(query)
            .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page);

        }

        else {
            totalNoOfLeads = await Lead.find().count()

            if (req.query.lookup) {
                list = await Lead.aggregate([lookupForCounsellorAssigned, lookupForStudentSupportSquad,
                    { $skip : no_of_docs_each_page * current_page_number }, 
                    { $limit : no_of_docs_each_page }
                ])
            }
            else list = await Lead.find()
                            .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page)
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                Total_No_Of_Leads:totalNoOfLeads,
                No_of_Leads: list.length,
                leads: list
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Available Leads',

            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }
}