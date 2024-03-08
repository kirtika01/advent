const Lead = require("../../../models/Lead");
const School = require("../../../models/SchoolRepo/School");
const moment = require("moment");

exports.addSchoolRecommendation = async (req, res) => {
    try {

        const lead = await Lead.findOne({ leadId: req.body.leadId })

        if(lead){
            const school =await School.findOne({schoolId:req.body.schoolId});

            if(school){
                if(lead.schoolRecommendation!=null){
                    const School =lead.schoolRecommendation;
                    const isSchoolPresent = School.find(({ schoolId }) => schoolId === `${req.body.schoolId}`);
                    if(isSchoolPresent){
                        throw new Error("School Recommendation Already Added , Try Another .")
                    }
                }
                const newSchoolRecommendation ={...req.body.schoolRecommendation,addedDate:new Date(),schoolId:req.body.schoolId};

                const updatelead = await Lead.findOneAndUpdate({leadId:req.body.leadId}, { $push: {schoolRecommendation:newSchoolRecommendation} }, { new: true })
            
                if(updatelead){
                    return res.status(200).json({
                        status: true,
                        message: "School Recommendation Added successfully",
                        leadId:req.body.leadId,
                        lead:updatelead,
                    })
                }
                else{
                    throw new Error("Unable to add school recommendation")
                }
            }
            else{
                return res.status(200).json({
                    status:false,
                    message: "School Not Found For School Id::"+req.body.schoolId
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
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}