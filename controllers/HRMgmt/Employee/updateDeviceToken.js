const Employee = require('../../../models/HRMgmt/Employee');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken')

exports.updateDeviceToken = async (req, res) => {

    try {

        let { employeeId, deviceToken } = req.body;


        let employee = await Employee.findOne({ employeeId : employeeId })

        if (!employee) {

            throw new Error(`Employee not found.`)
        }

        employee.deviceToken = deviceToken
        
        
        let doc = await employee.save();

        if (doc) {
            return res.status(200).json({
                status: true,
                message: "Device token added successfully"

            })
        } else {
            throw new Error(`Unable to add device token`);
        }

    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}