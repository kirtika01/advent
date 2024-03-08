const Claim = require('../../../models/HRMgmt/Claims');
const moment = require("moment");

exports.getSumOfClaimsByClaimType = async(req,res) =>{
    try{
        let time=req.query.period;
        let List;
        let previousdate = new Date();
        previousdate.setDate(previousdate.getDate()-time);
        let presentdate=new Date();
        

        //All closed Claims
        List = await Claim.aggregate([
            { $match: {claimStatus: {$in : ['RejectedLineManager' ,'FinanceRejected' ,'ClaimSettled'] }}}, 
            { $match: {appliedDate: {$gte: previousdate,$lte: presentdate}}},
            { $group: { _id : "$claimType",total: {  $sum: "$claimAmount" } }},
          ]);
        
        if (List.length > 0) {
            return res.status(200).json({
                status: true,
                SumOfClaims: List
            })
        } 
        else {
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