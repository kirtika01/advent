const LeavePlan = require("../../../models/HRMgmt/LeavePlan")

exports.getLeavePlanByLeavePlanId = async(req, res, next) => {
    try{

        const result= await LeavePlan.findOne({leavePlanId:req.params.leavePlanId})
        console.log(result)
        if(result===null){
            return res.status(200).json({
                status:false,
                message:"No Leave Plan found for leavePlan Id :: "+req.params.leavePlanId
            
            })

        }
        else{
            return res.status(200).json({
                status:true,
                LeavePlan:result
            })
        }

    
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    }
}

