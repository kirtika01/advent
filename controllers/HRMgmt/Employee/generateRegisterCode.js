const Employee = require('../../../models/HRMgmt/Employee');
const Counter = require('../../../models/Counter');
const random = require('random-string-alphanumeric-generator');
const axios = require('axios')

exports.generateRegisterCode = async (req, res) => {

    try {

        let employeeId = req.body.employeeId;

        let employee = await Employee.findOne({ employeeId: employeeId });

        if (!employee) {
           throw new Error(`Employee ${employeeId} not Found.`)
        }

        // function randomString(length, chars) {
        //     var result = '';
        //     for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        //     return result;
        // }
        // var uniqueId = randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

        let uniqueId = random.randomAlphanumeric(6, "uppercase");
        employee.registerCode = uniqueId;

        let subject = `Register Code Generated`
        let content = `Hello ${employee?.employeeFirstName}, \n \n Your Register Code is ${uniqueId}`
        let url = process.env.URL + '/api/v1/utils/sendEmail';

        let mailSent = await axios.post(url, {
            to: employee.officialEmail,  // Change to email address that you want to receive messages on
            subject: subject,
            text: content
        })

        if (mailSent.status === 200) {

            let doc = await employee.save()

            if (doc) {

                return res.status(200).json({
                    status: true,
                    message: `Register Code successfully generated`,
                    registerCode:uniqueId,
                    employee: employee,
                })

            } else {
                throw new Error(`Unable to generate Register Code`)
            }

        }


    } catch (err) {

        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}