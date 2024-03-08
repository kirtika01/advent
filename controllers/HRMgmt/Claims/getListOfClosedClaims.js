const Claim = require('../../../models/HRMgmt/Claims');
const moment = require("moment");

exports.getListOfClosedClaims = async (req, res) => {
    try {

        let list;

        //All Open Claims
        list = await Claim.find( { claimStatus: { $in: ['RejectedLineManager' ,'FinanceRejected' ,'ClaimSettled'] },raisedByEmpId:req.params.employeeId });
          
       
        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                listOfClaims: list,
                no: list.length
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Closed claims found ',

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