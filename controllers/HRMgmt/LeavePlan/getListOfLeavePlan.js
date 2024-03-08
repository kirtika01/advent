const LeavePlan = require("../../../models/HRMgmt/LeavePlan")

exports.getListOfLeavePlan = async (req,res)=>{

    try{
        
        var query={}

        if (req.query.isActive) {
            query['isActive'] = req.query.isActive;
        }
       
        if(req.query.isFlexiPlan){

            query['isFlexiPlan']=req.query.isFlexiPlan

        }

        let list 

        if (Object.keys(query).length > 0) list = await LeavePlan.find(query);
        else list = await LeavePlan.find()

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                No_of_LeavePlans: list.length,
                leaveplans: list,

            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Available LeavePlans',

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
