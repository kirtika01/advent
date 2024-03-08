const User = require("../../models/User");

exports.updateUser = async (req, res) => {

    try {

        let user = await User.findOne({userName:req.body.userName})


        if (user && user.employeeId != req.body.employeeId) {
            throw new Error("Use unique username, email and mobile number")
        }

        let saveUser = await User.findOneAndUpdate({ userName: req.body.userName }, { $set: req.body.update }, { new: true })

        if (!saveUser) {
            throw new Error('Unable to Update User. Contact support team')
        }

        return res.status(200).json({
            status: true,
            message: "User updated successfully",
            data: saveUser
        });


    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString(),
        });
    };

}
