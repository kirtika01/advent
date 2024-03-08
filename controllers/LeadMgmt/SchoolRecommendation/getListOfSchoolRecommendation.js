const Lead = require('../../../models/Lead')

exports.getListOfSchoolRecommendation= async(req, res) => {
    try{

        const lead=await Lead.findOne({leadId:req.params.leadId})
        if(lead){

            const SchoolRecommendationList = lead.schoolRecommendation;

            if (SchoolRecommendationList.length ==0)
            {
                return res.status(200).json({
                    status: true,
                    leadId:req.params.leadId,
                    message: "No School Recommendation added"
                })
                
            }
            else{
                SchoolRecommendationList.sort(function(a,b){
                    return new Date(b.addedDate) - new Date(a.addedDate);
                });
                return res.status(200).json({
                    status: true,
                    message: "School Recommendation List",
                    leadId:req.params.leadId,
                    SchoolRecommendationList:SchoolRecommendationList,
                })
            }
        }
        else{
            return res.status(200).json({
                status:false,
                message:"No Lead for Lead ID :: "+req.params.leadId
            })
        }
    }
    catch(err){
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    }
}