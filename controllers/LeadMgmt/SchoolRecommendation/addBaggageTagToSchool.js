const Lead = require("../../../models/Lead");


exports.addBaggageTagToSchool= async (req,res)=>{
    try {
        const lead = await Lead.findOne({ leadId: req.body.leadId })
        if(lead){
            
            if(lead.schoolRecommendation!=null){
                const School =lead.schoolRecommendation;
                const isSchoolPresent = School.find(({ schoolId }) => schoolId === `${req.body.schoolId}`);
                //console.log(isSchoolPresent)
                
                if(isSchoolPresent){
                    isSchoolPresent.tag=req.body.tag
                    const updateSchool =await Lead.findOneAndUpdate({leadId: req.body.leadId,"schoolRecommendation.schoolId":req.body.schoolId},{ "$set": { "schoolRecommendation.$":isSchoolPresent} },{new:true})
                    //console.log(updateSchool)
                    if(updateSchool){
                        return res.status(200).json({
                            status: true,
                            message: "School Baggate Tag Updated successfully ",
                            Result:updateSchool,
                        })
                    }
                    else{
                        throw new Error("Unable to update School Baggage Tag.")
                    }
                }
                else{
                    return res.status(200).json({
                        status:false,
                        message: "No School Available for School Id- "+req.body.schoolId
                    })
                   
                }
                
            }
            else{
                return res.status(200).json({
                    status:false,
                    message: "No School Recommendation Available"
                })

            }
        }
        else{
            return res.status(200).json({
                status:false,
                message: "Lead Not Found For Lead Id::"+req.body.leadId
            })

        }

    }
    catch(err){
        return res.status(500).json({
            status: false,
            error: err.toString()
        })

    }

}
