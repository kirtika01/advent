const OTP = require('../../../models/OTP')
const jwt = require('jsonwebtoken')


exports.validateOTPLead = async (req, res) => {

    try {

        const { leadPhoneNo,sessionId, otp } = req.body;
        const Otp = await OTP.findOne({ sessionId: sessionId, isExpired: false ,otp:otp,otpType:"Lead"})

        if(!Otp){
            return res.status(500).json({
                otpValidated: false,
                message: "Incorrect OTP. Please request for a new OTP"
            })
        }

        //check if it is valid ( now < validTill )
        if (Otp.validTill < Date.now()) {
            return res.status(500).json({
                otpValidated: false,
                message: "OTP Expired.Please request for a new OTP"
            })
        }

        let token = jwt.sign({platform: "LeadWeb", leadPhoneNo:leadPhoneNo }, process.env.JWT_KEY, { expiresIn: "4h" })
          
        //if validate, set OTP.isExpired = true
        Otp.isExpired = true;
        let doc = await Otp.save()

        if(!doc){
            throw new Error("OTP not saved")
        }

        //return token
        return res.status(200).json({
            otpValidated: true,
            token: token,
            message: "OTP Validated"
        })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}