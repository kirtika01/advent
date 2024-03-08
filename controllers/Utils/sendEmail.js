const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {

    try {

        let { to, cc, subject, text, html } = req.body;
        //console.log(req.body)

        console.log(html)

        var transport = {
            service: process.env.MAIL_SERVICE,
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        }

        var transporter = nodemailer.createTransport(transport)

        transporter.verify((error, success) => {
            if (error) {
                throw new Error(error)
            } else {
                console.log('Server is ready to take messages');
            }
        });


        var mail;

        if (cc) {
            mail = {
                from: process.env.MAIL_USER,
                to: to,  // Change to email address that you want to receive messages on
                cc: cc,
                subject: subject,
                text: text,
                html: html

            }
        } else {

            mail = {
                from: process.env.MAIL_USER,
                to: to,  // Change to email address that you want to receive messages on
                subject: subject,
                text: text,
                html: html
            }

        }

        transporter.sendMail(mail, (err, data) => {
            if (err) {
                throw new Error(`Error in sending email - ${err}`)
               
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Mail successfully sent'
                })
            }
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }

}
