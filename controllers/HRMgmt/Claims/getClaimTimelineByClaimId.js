const Claim=require('../../../models/HRMgmt/Claims');

exports.getClaimTimelineByClaimId = async(req,res)=>{
    try{


        const claimId = req.params.claimId;

        const claim= await Claim.findOne({claimId:claimId})

        if (claim){

            let claimTimeline = {}

            claimTimeline.claimId = claim.claimId,
            claimTimeline.claimStatus = claim.claimStatus
            claimTimeline.appliedDate = claim.appliedDate
            claimTimeline.isAutoApprovedLineMgr = claim.isAutoApprovedLineMgr
            claimTimeline.isApprovedLineMgr = claim.isApprovedLineMgr
            claimTimeline.lineMgrApprovalDate = claim.lineMgrApprovalDate
            claimTimeline.lineMgrFullName = claim.lineMgrFullName
            claimTimeline.lineMgrApprovalComments = claim.lineMgrApprovalComments
            claimTimeline.isApprovedFinance = claim.isApprovedFinance
            claimTimeline.financeApprovalDate = claim.financeApprovalDate
            claimTimeline.financeApproverFullName = claim.financeApproverFullName
            claimTimeline.financeApprovalComments = claim.financeApprovalComments
            claimTimeline.financeApprovalDate = claim.financeApprovalDate
            
            
            claimTimeline.paymentDone = claim.paymentDone
            claimTimeline.financePaymentDate = claim.financePaymentDate
            claimTimeline.paymentVoucherId = claim.paymentVoucherId
            claimTimeline.financePaymentMode = claim.financePaymentMode
            

            return res.status(200).json({
                status:true,
                claimTimeline:claimTimeline
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
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}