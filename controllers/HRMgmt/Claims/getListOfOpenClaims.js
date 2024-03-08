const Claim = require('../../../models/HRMgmt/Claims');
const moment = require("moment");

exports.getListOfOpenClaims = async (req, res) => {
    try {

        let list;

        // let query = { claimStatus: { $in: ['LineManagerApproval', 'AutoApproved', 'ApprovedLineManager', 'FinanceApproved'] } }

        // if (req.query.raisedByEmpId) {
        //     query = { ...query, raisedByEmpId: req.query.raisedByEmpId }
        // }

        // if (req.query.claimType) {
        //     query = { ...query, claimType: req.query.claimType }
        // }


        // list = await Claim.find(query);
        list = await Claim.find( { claimStatus: { $in: ['LineManagerApproval','AutoApproved' ,'ApprovedLineManager','FinanceApproved'] },raisedByEmpId:req.params.employeeId });


        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                no : list.length,
                listOfClaims: list
                
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Open claims found',

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