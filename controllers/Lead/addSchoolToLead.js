const Lead = require("../../models/Lead");
const School = require("../../models/School");

exports.addSchoolToLead = async (req, res) => {
    try {

        const lead = await Lead.findOne({ leadId: req.body.leadId })

        if (!lead) {
            
            throw new Error(`No Lead found for Lead ID ${req.body.leadId}`)
        }

        const school = await School.findOne({ schoolId: req.body.schoolId })

        if (!school) {
           
            throw new Error(`No School found for School ID ${req.body.schoolId}`)

        }

        let addschool ={
            schoolId:school.schoolId,
            schoolName:school.schoolName,
            city:school.schoolCity,
            country:school.schoolCountry,
            intake:school.schoolIntake,
            logo:school.schoolLogo,
            thumbNail:school.schoolThumbNail
        }

        addschool.recommendationDate =  new Date();


        const updateLead = await Lead.findOneAndUpdate({ leadId: req.body.leadId }, { $push: { schoolRecommendationArray: addschool } }, { new: true })
        
        if (updateLead) {
            return res.status(200).json({
                status: true,
                message: "School Added Succesfully",
                Lead:updateLead
            })
        }
        else {
            throw new Error("Unable to Add School")
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}