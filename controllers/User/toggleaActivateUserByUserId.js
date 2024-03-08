const User= require("../../models/User");

exports.toggleaActivateUserByUserId= async (req,res) =>{
    try{

        const updateuser=await User.findOneAndUpdate({userId:req.body.userId},[{"$set": {isActive: {"$not": "$isActive"}}}],{new:true})


        if (!updateuser) {
            return res.status(200).json({
                status: false,
                message: "No User found for- "+req.body.userId,
                user: updateuser
            })
        }
        else {
            return res.status(200).json({
                status: true,
                message: "Updated",
                user: updateuser
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