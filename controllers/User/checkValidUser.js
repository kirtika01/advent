const User = require('../../models/User');

exports.checkValidUser = async (req, res) => {

    try{

        let checkUser = await User.findOne({userName: req.query.userName});

        if(!checkUser){
            return res.status(500).json({
                status: false,
                message: "Username does not exists"
            })
        }

        if (checkUser.userType === req.query.userType) {
            return res.status(200).json({
                status: true,
                message: "User is valid"
            })
        }
        else {
            return res.status(500).json({
                status: false,
                message: "User is not valid"
            })
        }

    }
    catch(err){
        return res.status(500).json({
            status: false,
            error: err.toString(),
        });
    };
}