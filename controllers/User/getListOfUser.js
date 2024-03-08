const User= require("../../models/User");

exports.getListOfUser= async (req,res) =>{

    try{
        let query = {};
       
        if (req.query.isActive) {
            query['isActive'] = req.query.isActive
        }

        if (req.query.userDepartment) {
            
            query['userDepartment'] = req.query.userDepartment
        }

        if (req.query.isEmployee) {
            
            query['isEmployee'] = req.query.isEmployee
        }

        if (req.query.userType) {
            
            query['userType'] = req.query.userType
        }

        if(query==null){

            var result= await User.find();
        }
        else{
            let result = await User.find(query);

            if(result){
                return res.status(200).json({
                    status: true,
                    noOfUser:result.length,
                    Users: result
                });
            }
            else{
                return res.status(200).json({
                    status: false,
                    message:"No User Found"
                });
            }


        }

        

    }
    catch (err){
        console.log(err);
    return res.status(500).json({
      status: false,
      error: err,
    });
    }
};
