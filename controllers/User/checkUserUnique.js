const User= require("../../models/User");
const Employee= require("../../models/HRMgmt/Employee")

exports.checkUserUnique= async (req,res) =>{
    try{

        var userName = await User.findOne({userName:req.body.userName})
        var employee = await Employee.findOne({employeeId:req.body.employeeId})

        if(userName){
            throw new Error("User already exist")
        }
        if(employee){
            throw new Error("Employee already exist")
        }
        else{
            return res.status(200).json({
                status:true,
                message: "Unique Combination"
            })
        }   
            
    }
    
    catch(err){

        console.log(err)
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    }
}
