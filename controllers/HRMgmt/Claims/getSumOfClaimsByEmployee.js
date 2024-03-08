const Claim = require('../../../models/HRMgmt/Claims');
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require("moment");

exports.getSumOfClaimsByEmployee = async(req,res) =>{
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
            { $group: { _id : "$raisedByEmpId",total: {  $sum: "$claimAmount" } }},
          ]);
        
        if (List.length > 0) {
            for(let i = 0; i < List.length; i++){
                let EmpId = List[i]._id;
                const currEmployee=await Employee.findOne({employeeId:EmpId});
                if(currEmployee){
                    employeeFullName = currEmployee.employeeFirstName
                    if (currEmployee.employeeMiddleName) {
                        employeeFullName += " ";
                        employeeFullName += currEmployee.employeeMiddleName;
                    }
                    employeeFullName += " " + currEmployee.employeeLastName;

                    List[i]._id =employeeFullName;   
                }
                else {
                    return res.status(200).json({
                        status: false,
                        message: 'No Employee With This Id',
                       
                    })
                }
            }
            //console.log(List);
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