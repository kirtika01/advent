const User= require("../../models/User");

exports.updateUserByUserId = async(req,res) =>{
    try{
        const user = await User.findOne({userId:req.body.userId})

        if(user){

            const updateuser=await User.findOneAndUpdate({userId:req.body.userId},req.body,{new:true})
            if(updateuser){
                return res.status(200).json({
                    status:true,
                    message: "User successfully updated"
                })
            }else{
                return res.status(200).json({
                    status:false,
                    message: "Unable to update User"
                })
            }
        }
        else{
            return res.status(200).json({
                status:false,
                message: "User does not exists"
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