const User=require('../../../models/User')
const axios=require('axios')



exports.sendOtpEmployee=async(req,res)=>{

    let notAUser=false
    try{
        var user=await User.findOne({userName:req.body.userName})

        if(!user){
            notAUser=true
            throw new Error("Username is not registered. Contact Administrator")
        }

        console.log("Hi")
        if(user.isActive === true){
            var digits = '0123456789'; 
            let generateOtp= ''; 
            for (let i = 0; i < 4; i++ ) { 
                generateOtp += digits[Math.floor(Math.random() * 10)]; 
            } 
            //user.otp=generateOtp
            user.otp=1234

            let url = process.env.URL + '/api/v1/utils/sendEmail'
            let subject = `OTP for Login`;

            let text

            
            text = `Hi ${user.userFirstName}, \n \n Please find below your OTP \n \n ${generateOtp}`;

            
            let mailSent = await axios.post(url, {
                to: user.registeredEmailId,  // Change to email address that you want to receive messages on
                subject: subject,
                text: text
            })
            console.log("HHi")
            if(mailSent.status= 200){
                await user.save()
                return res.status(200).json({
                    status:true,
                    invalidUser:notAUser,
                    message:"OTP Sent"
                })
            }
            

        }
        else{

            if(user.isActive === false){

                throw new Error("Username is inactive. Contact Administrator")
            }
            
        }
        
    }



    catch (err) {
        console.log(err);
            return res.status(500).json({
            status: false,
            invalidUser:notAUser,
            error: err.toString(),
            });

    }
};