const Counter = require('../../../models/Counter');
const CompOff = require('../../../models/HRMgmt/CompOff');
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require('moment-timezone');

exports.applyCompOff = async (req, res) => {
    try {

        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if (!employee) {
            throw new Error(`Employee ${req.body.employeeId} not found`)
        }

        let compOff = new CompOff(req.body);
        let counter = await Counter.findOneAndUpdate({ identifierName: "CompOff" }, { $inc: { count: 1 } },
            { upsert: true, new: true });

        compOff.compOffId = `CMP-${counter.count}`;
        compOff.compOffDate = moment.tz(new Date(req.body.compOffDate), "Asia/Kolkata")
        compOff.raisedByFullName = employee.employeeFullName;
        compOff.raisedBy = employee.userName;
        compOff.raisedByEmpId = employee.employeeId;
        compOff.lineManagerEmpId = employee.lineManagerId;
        compOff.lineManagerFullName = employee.lineManagerName;

        let doc = await compOff.save();

        if (doc) {

            return res.status(200).json({
                status: true,
                message: 'Compensatory Off Applied Successfully',
                compOff: doc
            })

        }
        else {
            throw new Error(`Unable to apply CompOff`)
        }


    } catch (err) {
        await Counter.findOneAndUpdate({ identifierName: "CompOff" }, { $inc: { count: -1 } },
            { upsert: true, new: true });
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}