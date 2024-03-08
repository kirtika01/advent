const Claim=require('../../../models/HRMgmt/Claims');

exports.getClaimByClaimId = async(req,res)=>{
    try{
        const claimId = req.params.claimId;

        const claim= await Claim.findOne({claimId:claimId})

        if (claim){

            return res.status(200).json({
                status:true,
                claim:claim
            })

        }
        else{

            return res.status(200).json({
                status:false,
                Message:"No Claim Available"
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