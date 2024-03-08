const User=require('../../models/User')
const axios=require('axios')



exports.sendOtp=async(req,res)=>{
    try{
        var user=await User.findOne({userId:req.body.userId})
        if(user){
            var digits = '0123456789'; 
            let generateotp= ''; 
            for (let i = 0; i < 4; i++ ) { 
                generateotp += digits[Math.floor(Math.random() * 10)]; 
            } 
            user.otp=generateotp
            var body=`
            Hi ${user.userFirstName}+" "+${user.userLastName}, <br>
            
            Please find the OTP as below. Please use it for Login Purpose <br>

            ${generateotp}

            `

        var mailBody="<p>"+body+"</p>"
        var subject=`OTP for Advent Education Admin Application`
        sendMail=await axios.post(`${process.env.URL}/api/v1/util/emailSender`,{mailBody:mailBody,toEmail:user.officialEmailId,subject:subject})
        if (sendMail.status!==200)
        {
            return res.status(200).json({
            
                otpSent:false,
                message: `Contact Administrator. Email Error`
            })
        }


        customer.generateOTP=generateotp
        result=customer.save()
        if (result)
        {
            return res.status(200).json({
                otpSent:true
            })
        }
    }
}


    catch (err) {
        console.log(err);
            return res.status(500).json({
            status: false,
            error: err,
            });

    }
};