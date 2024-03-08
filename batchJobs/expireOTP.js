var cron = require('node-cron');
const OTP = require('../models/OTP');

cron.schedule('*/11 * * * *', async () => {
    try{
        console.log('ExpireOTP Job Initiated:::')

        
        let otps = await OTP.find({isExpired: false, validTill: {$lt: new Date()}})

        //let otps = await OTP.find({isExpired: false, validTill: })

        console.log(otps.length)

        if(otps.length > 0){
            await otps.reduce(async (promise, key) => {
                await promise;
                let otp = await OTP.findOne({otp: key.otp})
                otp.isExpired = true

                let doc = await otp.save()
                if(doc){
                    console.log(`OTP - ${key.otp} updated`)
                }
                else{
                    console.log(`Could not update OTP - ${key.otp}`)
                }
            }, Promise.resolve())
        }
        console.log('ExpireOTP Job Terminated:::')
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
})