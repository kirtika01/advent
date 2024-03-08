const Branch= require("../../../models/HRMgmt/Branch");

exports.toggleBranch = async (req, res) => {

    try{

        const branch=await Branch.findOne({branchCode:req.body.branchCode})

        if(!branch){
            throw new Error ("Unable to find Brach for Branch Code - " + req.body.branchCode)
        }

        else{

            let toggle= await Branch.findOneAndUpdate({branchCode:req.body.branchCode}, [{"$set": {isActive: {"$not": ["$isActive"]}}}],{new:true})        

            if(toggle){
                return res.status(200).json({
                    status:true,
                    message:"Branch Toggled Succesfully"
                })
            }

            else{
                throw new Error ("Unable to Toggle Brach ")
            }

        }
    }
    catch(err){

        console.log(err)
        res.status(500).json({
            status:false,
            message:err.toString()
        })

    }
}