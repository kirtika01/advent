const Student=require('../../../models/Student/Student')
const axios=require('axios')



exports.sendOTPToStudent=async(req,res)=>{
    try{
        var student=await Student.findOne({studentPhoneNo:req.body.studentPhoneNo})

        if(!student){
            return res.status(200).json({
                registered:false,
                message:"Student is not registered. Redirect to Register Page"
            })
        }


        
        var digits = '0123456789'; 
        let generateOtp= ''; 
            for (let i = 0; i < 4; i++ ) { 
                generateOtp += digits[Math.floor(Math.random() * 10)]; 
            } 
        //student.otp=generateOtp
        student.otp=1234

        let url = process.env.URL + '/api/v1/utils/sendEmail'
        let subject = `OTP for Login`;

        let text

            
        text = `Hi ${student.studentFirstName}, \n \n Please find below your OTP \n \n ${generateOtp}`;

            
        let mailSent = await axios.post(url, {
            to: student.studentEmailId,  // Change to email address that you want to receive messages on
            subject: subject,
            text: text
        })

        if(mailSent.status= 200){
            await student.save()
            return res.status(200).json({
                status:true,
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