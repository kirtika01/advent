const School = require("../../../models/SchoolRepo/School");


exports.getSchoolBySchoolId= async(req,res) =>{

    try{

        const school= await School.findOne({schoolId:req.params.schoolId})

        if(school){

            return res.status(200).json({
                status:true,
                School:school
            })
        }
        else{

            return res.status(200).json({

                status:false,
                message: "School Not Found For School Id::"+req.params.schoolId
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