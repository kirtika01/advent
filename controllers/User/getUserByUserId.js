const User= require("../../models/User");

exports.getUserByUserId= async (req,res) =>{

try{
var user= await User.findOne({userId:req.params.userId})

if (user){
    return res.status(200).json({
        status:true,
        user:user
    });
}
else{
    return res.status(200).json({
        status:true,
        message:"No User Found"
    });
}

}

catch (err){
    console.log(err);
    return res.status(500).json({
        status: false,
        error:err
    });
}
};