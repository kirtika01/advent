const School = require("../../../models/SchoolRepo/School");
exports.activateSchoolToggle = async (req,res) => {
    try{
        const school= await School.findOne({schoolId:req.body.schoolId})

        if(school){
            if(school.isActive == true && req.body.activate ==true ){
                throw new Error("School Already active")
            }
            else if(school.isActive == false && req.body.activate ==false ){
                throw new Error("School Already inactive")
            }
            else if(school.isActive == true && req.body.activate ==false){
                school.isActive =true

                let doc = await school.save();
                if(!doc){ throw new Error ("Unable to deactivate School")}
                else{
                    return res.status(200).json({
                        status: false,
                        message:"School deactivated"
                    })
                }
            }
            else{
                
            }
        }
        else{
            return res.status(200).json({
                status:false,
                message: "School Not Found For School Id::"+req.body.schoolId
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