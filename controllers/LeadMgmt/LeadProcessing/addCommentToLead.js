const Lead =require("../../../models/LeadMgmt/Lead");

exports.addCommentToLead = async (req, res) => {
    try {

        console.log(req.body);
        let comment=req.body.comment
        let leadID=req.body.leadId

       
        const lead = await Lead.findOne({leadId:leadID})

        
        if(lead){
            //console.log(comment,"from Add Comment");
            lead.comments.push(comment)
            let doc =await lead.save();

            if (!doc) {
                throw new Error(
                    `Unable to Add New Comment to lead ${req.body.leadId}`
                )
            }
            return res.status(200).json({
                status:true,
                message:"Successfully added Comment in lead ::"+ leadID,
                leadId:leadID,
                lead:doc
            })

        }
        else{
            throw new Error("Unable to find lead for Lead ID :: "+leadID)
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