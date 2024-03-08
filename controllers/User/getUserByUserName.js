const User = require('../../models/User');

exports.getUserByUserName = async (req, res) => {

    try{

        let checkUser = await User.findOne({userName: req.params.userName});

        if(!checkUser){
            return res.status(200).json({
                status: false,
                message:`User with userId ${req.params.userName} does not exists`
            })
        }
        
        return res.status(200).json({
            status: true,
            user:checkUser
        })
        

    }
    catch(err){
        return res.status(500).json({
            status: false,
            error: err.toString(),
        });
    };
}