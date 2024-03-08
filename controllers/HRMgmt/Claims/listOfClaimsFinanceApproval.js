const Claims = require('../../../models/HRMgmt/Claims');
const moment = require("moment");

exports.listOfClaimsFinanceApproval = async(req,res) =>{
    try{
        
        let list;
        let query = {claimStatus: { $in: ['AutoApproved' ,'ApprovedLineManager'] }}

        if(req.query.raisedByEmpId){
            query = {...query , raisedByEmpId:req.query.raisedByEmpId}
        }

        if(req.query.claimType){
            query = {...query , claimType:req.query.claimType}
        }

        list = await Claims.find(query);
          
        
        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                listOfClaims: list,
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No cliams Found'
               
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