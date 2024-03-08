const jwt = require('jsonwebtoken')

const authenticate = (req,res,next)=>{
        if(typeof(req.headers.authorization)=='undefined'){
            res.status(401).json({
                message:'Authorization token required!'
            })
        }
        const token = req.headers.authorization.split(' ')[1];
        //console.log(token)
        jwt.verify(token,process.env.JWT_KEY, (err,decode)=>{
            if(err){
                let temp=err
                if(err.name=="TokenExpiredError"){
                    res.status(405).json({
                        message:"Authentication Timeout!"
                    })
                }
                else{
                    res.status(403).json({
                        message:"Authentication Failed!",err
                    })
                }
            }
            else{
                req.user = decode
                req.token=token
                next()

            }
        })

}

module.exports = {authenticate}