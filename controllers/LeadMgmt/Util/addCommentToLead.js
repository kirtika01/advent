const Lead = require("../../../models/LeadMgmt/Lead");

exports.addCommentToLead = async (leadId,commentMessage,commentedByFullName,commentedByStringcommentedBy,commentType) => {

    try{

        let lead = await Lead.findOne({leadId:leadId})

        if(!lead){
            throw new Error('Lead Not Found')
        }

        let commentedByString
        if(commentedByFullName===`System`){
            commentedByString= `System`
        }
        else{
            commentedByString= `${commentedByFullName} ${commentedBy} `
        }

        let comment= {
            comment: commentMessage,
            commentedBy: commentedByString,
            commentType: commentType,
            commentTime: new Date()
        }

        lead.comments.push(comment)

        let saveLead = await lead.save()
        if(!saveLead){
            throw new Error('Error in saving lead')
        }
        return true

    }
    catch(err){
        console.log(err)
        return false        
    }
}