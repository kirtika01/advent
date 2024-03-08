    const jwt = require('jsonwebtoken')

const authenticateOTPTokens = (req, res, next) => {

    if (typeof (req.headers.authorization) == 'undefined') {
        res.status(401).json({
            message: 'Authorization token required!'
        })
    }

    const token = req.headers.authorization.split(' ')[1];
    //console.log(token)
    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            let temp = err
            if (err.name == "TokenExpiredError") {
                res.status(405).json({
                    message: "Authentication Timeout!"
                })
            }
            else {
                res.status(403).json({
                    message: "Authentication Failed!", err
                })
            }
        }
        else {

            console.log("platform "+decode.platform)
            if(decode.platform == 'studentDashboard'||decode.platform == 'employeeWeb'||decode.platform == 'employeeMobile'|| decode.platform == 'LeadWeb'){
            
                if (decode.platform != req.headers.platform) {
                    res.status(403).json({
                        message: "Authentication Failed!. Platform doesn't match"
                    })
                } else {
                    req.user = decode
                    req.token = token
                    next()
                }
            }
            else if (decode.platform == 'activation'){
                console.log(decode.platform, req.headers.platform , '43')
                if (decode.platform != req.headers.platform) {
                    res.status(403).json({
                        message: "Authentication Failed!. Platform doesn't match"
                    })
                } else {
                    
                    req.token = token
                    next()
                }
            }
            else{
                res.status(403).json({
                    message: "Authentication Failed!. Invalid Platform"
                })
            }
            

        }
    })

}

module.exports = { authenticateOTPTokens }