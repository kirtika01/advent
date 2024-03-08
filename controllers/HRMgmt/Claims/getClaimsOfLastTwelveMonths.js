const Claim = require('../../../models/HRMgmt/Claims');
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require("moment");

exports.getClaimsOfLastTwelveMonths = async(req,res) =>{
    try{
        let List;
        var date = new Date();
        let previousdate = new Date(date.getFullYear(), date.getMonth(), 1);
        let presentdate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let ListOfClaims=[];
        let Total=0,Approved=0,Rejected=0;
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];


        for(let i=30;i<=360;i+=30){
            List = await Claim.aggregate([
                { $match: {claimStatus: {$in : ['RejectedLineManager' ,'FinanceRejected' ,'FinanceApproved'] }}}, 
                { $match: {appliedDate: {$gte: previousdate,$lte: presentdate}}},
                { $group: { _id : "$claimStatus",Count:{$sum: 1} }},
            ]);
            //console.log(List);
            if(List.length>0){

                for(let i = 0; i < List.length; i++){
                    if(List[i]._id=="RejectedLineManager" || List[i]._id=="FinanceRejected" )
                        Rejected+=parseInt(List[i].Count);
                    if(List[i]._id=="FinanceApproved")
                        Approved+=parseInt(List[i].Count);
                }
                Total=Rejected+Approved;
    
                let name = month[previousdate.getMonth()];
                //console.log(name);

                const Obj={
                    month:name,
                    total:Total,
                    approved:Approved,
                    rejected:Rejected
                }
                //console.log(Obj);

                ListOfClaims=[...ListOfClaims,Obj];
                Total=0,Approved=0,Rejected=0;
                previousdate.setDate(previousdate.getDate()-i);
                presentdate.setDate(presentdate.getDate()-i);
            }   
        }
        return res.status(200).json({
            status: true,
            NumberOfClaims: ListOfClaims
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}