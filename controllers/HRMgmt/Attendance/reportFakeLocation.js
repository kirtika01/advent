const Attendance = require('../../../models/HRMgmt/Attendance');
const Employee = require('../../../models/HRMgmt/Employee');
const axios = require('axios');

exports.reportFakeLocation = async (req, res) => {
    try {
        var token = req.headers.authorization.split(' ')[1]

        const employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error(`Employee with employeeId - ${req.body.employeeId} not found`)
        }

        const lineManager = await Employee.findOne({ employeeId: employee.lineManagerId });
        const HRManager = await Employee.findOne({ employeeId: employee.hrManagerId });

        if (!lineManager) {
            throw new Error(`Employee with employeeId - ${employee.lineManagerId} not found`)
        }
        if (!HRManager) {
            throw new Error(`Employee with employeeId - ${employee.hrManagerId} not found`)
        }

        let platform;
        if (req.body.isActivation === true || req.body.isActivation === 'true') {
            platform = "activation"
        }
        else {
            platform = "employeeMobile"
        }

        //send notification to line Manager

        url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
        let sendNotifytolineManager = await axios.post(url, {
            "notificationAudience": "TeamMember",
            "notificationHeadline": "Fake Location Usage Reported" ,
            "notificationBody": `Your Team Member ${employee.employeeFullName} (Emp ID:${employee.employeeId})
                                     reported to use Fake Location on ${req.body.incidentDate}`,
            "employeeId": employee.lineManagerId,
            "notificationPriority": "High"
        }, {
            headers: {
                Authorization: req.headers.authorization,
                platform: platform
            }
        })
        //console.log(sendNotifytolineManager)

        if (sendNotifytolineManager.status !== 200) {
            console.log(`Unable to send notification to line Manager`)
        }

        //send Notification to HR Manager

        url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
        let sendNotifytoHRManager = await axios.post(url, {
            "notificationAudience": "TeamMember",
            "notificationHeadline": "Fake Location Usage Reported" ,
            "notificationBody": `Your Team Member ${employee.employeeFullName} ( Emp ID:${employee.employeeId})
                                    reported to use Fake Location on ${req.body.incidentDate}`,
            "employeeId": employee.hrManagerId,
            "notificationPriority": "High"
        }, {
            headers: {
                Authorization: req.headers.authorization,
                platform: platform
            }
        })
        //console.log(sendNotifytoHRManager)

        if (sendNotifytoHRManager.status !== 200) {
            console.log(`Unable to send notification to HR Manager`)
        }

        return res.status(200).json({
            status: true,
            message: `Reported fake Location to both Line Manager and HR Manager of ${req.body.employeeId}`
        })


    } 
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}