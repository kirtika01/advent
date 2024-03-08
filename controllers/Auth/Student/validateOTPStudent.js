const Student=require('../../../models/Student/Student')
const jwt = require('jsonwebtoken')


exports.validateOTPStudent = async (req, res) => {

    try {

        const { studentPhoneNo, otp } = req.body;
        const student = await Student.findOne({ studentPhoneNo: studentPhoneNo })

        

        if (student) {

            console.log('yes')

            //if ( otp==="1234"||otp===1234) {
                if ( otp===student.otp) {
                student.otp = null;

                let token;
                
                token = jwt.sign({ studentPhoneNo: student.studentPhoneNo,studentId: student.studentId, platform: req.body.platform }, process.env.JWT_KEY, { expiresIn: "8640h" })
               


                let doc = await student.save()

                if (!doc) {
                    throw new Error(`Unable to Login`)
                }

                else {

                    return res.status(200).json({
                        otpValidated: true,
                        token: token,
                        user: user,
                        message: "OTP Validated"

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
            return res.status(500).send({ message: "Student not found" })
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