const CompOff = require('../../../models/HRMgmt/CompOff');
const Employee = require('../../../models/HRMgmt/Employee');
const moment = require('moment-timezone');

exports.approveCompOff = async (req, res) => {
    try {

        
        let compOff = await CompOff.findOne({ compOffId: req.body.compOffId });

        if (!compOff) {
            throw new Error(`CompOff ${req.body.compOffId} not found`)
        }
        let employee = await Employee.findOne({ employeeId: compOff.raisedByEmpId });

        if (!employee) {
            throw new Error(`Employee ${compOff.raisedByEmpId} not found`)
        }



        compOff.approvalDate = moment.tz(new Date(), "Asia/Kolkata");

        if (req.body.isApproved===true || req.body.isApproved==='true') {
            compOff.compOffStatus = 'Approved';

            employee.leaveBalance.casualLeave += 1;
            await employee.save();
        } else {
            compOff.compOffStatus = 'Rejected';
        }

        compOff.approvalComment = req.body.approvalComment;

        let doc = await compOff.save();

        if (doc) {

            return res.status(200).json({
                status: true,
                message: `Compensatory Off ${req.body.isApproved ? 'Approved' : 'Rejected'}  Successfully`,
                compOff: doc
            })

        }
        else {
            throw new Error(`Unable to ${req.body.isApproved ? 'Approved' : 'Rejected'} CompOff : ${req.body.compOffId}`)
        }


    } catch (err) {

        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}