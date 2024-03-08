const Lead = require('../../models/Lead')

exports.getListOfLeadCommentByLeadId = async(req, res) => {
    try{

        const result=await Lead.findOne({leadId:req.params.leadId})
        if(result){

            comments=result.comments 
            return res.status(200).json({
                status:true,
                comments:comments
            })
        }else{
            return res.status(200).json({
                status:false,
                message:"No Comment available for Lead ID :: "+req.params.leadId
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