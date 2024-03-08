const OTP = require('../../../models/OTP')
const axios=require('axios')
const random = require('random-string-alphanumeric-generator');


exports.sendOTPLead=async(req,res)=>{
    try{
        
        let newOTP= new OTP()

        var sessionId = random.randomAlphanumeric(12, "uppercase");
        
        //set validity New date + 10 mins
        var validTill = new Date();
        validTill.setMinutes(validTill.getMinutes() + 10);

        newOTP.otpType= "Lead"
        newOTP.sessionId= sessionId
        newOTP.validTill= validTill
        newOTP.leadPhoneNo=req.body.leadPhoneNo

        
        var digits = '0123456789'; 
        let generateOtp= ''; 
            for (let i = 0; i < 4; i++ ) { 
                generateOtp += digits[Math.floor(Math.random() * 10)]; 
            } 
        console.log(generateOtp)
        newOTP.otp= generateOtp

        await newOTP.save()
        if(!newOTP){
            throw new Error("OTP not saved")
        }
        let url = process.env.URL + '/api/v1/utils/sendEmail'
        let subject = `OTP for Login`;

        let text

            
        text = `Hi, \n \n Please find below your OTP \n \n ${generateOtp}`;

            
        let mailSent = await axios.post(url, {
            to: req.body.leadEmail,  // Change to email address that you want to receive messages on
            subject: subject,
            text: text
        })

        if(mailSent.status= 200){
            return res.status(200).json({
                status:true,
                sessionId:sessionId,
                message:"OTP Sent"
            })
        }
        else{
            throw new Error("OTP not sent")
        } 
    }
    catch (err) {
        console.log(err);
            return res.status(500).json({
            status: false,
            error: err.toString(),
            });

    }
};