const jwt = require('jsonwebtoken')

exports.getTokenByActivationCode = async (req, res) => {
    try {
        let activationToken = req.body.activationToken

        if ( activationToken == "ABCD1234" ) {
                let token;
                token = jwt.sign({ platform:"activation" }, process.env.JWT_KEY, { expiresIn: "8640h" })

                return res.status(200).json({
                    activationTokenValidated: true,
                    token: token,
                    message: "activationToken Validated"

                });
        }
        else{
            return res.status(403).json({
                otpValidated: false,
                message: "Invalid Activation Token"
            });
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