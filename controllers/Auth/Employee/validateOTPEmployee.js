const User = require('../../../models/User')
const Employee = require('../../../models/HRMgmt/Employee')

const jwt = require('jsonwebtoken')


exports.validateOTPEmployee = async (req, res) => {

    try {

        const { userName, OTP } = req.body;
        const user = await User.findOne({ userName: userName })

        console.log(user);

        if (user) {

            console.log('yes')
            if ( OTP==="1234"||OTP===1234) {
                user.otp = null;

                let token;
                if (req.body.platform === 'employeeWeb' || req.body.platform === 'employeeMobile') {
                    token = jwt.sign({ userName: user.userName,employeeId: user.employeeId, platform: req.body.platform }, process.env.JWT_KEY, { expiresIn: "8h" })
                } else {
                    token = jwt.sign({ userName: user.userName, platform: 'studentDashboard' }, process.env.JWT_KEY, { expiresIn: "8640h" })
                }


                let doc = await user.save()

                if (!doc) {
                    throw new Error(`Unable to Login`)
                }



                if (user.userType === "Employee") {

                    let employee = await Employee.findOne({ employeeId: user.employeeId })

                    if (employee) {


                        return res.status(200).json({
                            otpValidated: true,
                            token: token,
                            userName: user.userName,
                            employeeId: employee.employeeId,
                            employeeFirstName: employee.employeeFirstName
                        })

                    }
                    else {
                        throw new Error("Unable to find Employee")
                    }

                }

                else {

                    return res.status(200).json({
                        otpValidated: true,
                        token: token,
                        user: user

                    })

                }


            }
            else {
                return res.status(200).json({
                    otpValidated: false,
                    message: "Incorrect OTP"
                })
            }
        } else {
            return res.status(500).send({ message: "user not found" })
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