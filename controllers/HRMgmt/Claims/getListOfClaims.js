const Claim = require('../../../models/HRMgmt/Claims');

exports.getListOfClaims = async (req, res) => {
    try {

        let query = {};

        if (req.query.claimType) {
            query['claimType'] = req.query.claimType;
        }

        if (req.query.claimStatus) {
            if (req.query.claimStatus === 'open') {
                query["claimStatus"] =  {$in: ['LineManagerApproval', 'AutoApproved', 'ApprovedLineManager', 'FinanceApproved']} 
            } else if (req.query.claimStatus === 'closed') {
                query["claimStatus"] = { $in: ['RejectedLineManager', 'FinanceRejected', 'ClaimSettled'] } 
            } else {
                query['claimStatus'] = req.query.claimStatus;
            }
        }

        if (req.query.raisedByEmpId) {
            query['raisedByEmpId'] = req.query.raisedByEmpId;
        }

        if (req.query.isAutoApprovedLineMgr) {
            query['isAutoApprovedLineMgr'] = req.query.isAutoApprovedLineMgr;
        }

        if (req.query.lineMgrEmpId) {
            query['lineMgrEmpId'] = req.query.lineMgrEmpId;
        }

        if (req.query.isApprovedLineMgr) {
            query['isApprovedLineMgr'] = req.query.isApprovedLineMgr;
        }

        if (req.query.financeApproverEmpId) {
            query['financeApproverEmpId'] = req.query.financeApproverEmpId;
        }

        if (req.query.paymentDone) {
            query['paymentDone'] = req.query.paymentDone;
        }

        
        let list;

        if (Object.keys(query).length > 0) {

            list = await Claim.find(query);
        } else {
            list = await Claim.find()
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                listOfClaim: list,
                no: list.length
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Available Claims',

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