const Leave = require("../../../models/HRMgmt/Leave")
const Employee = require("../../../models/HRMgmt/Employee")
const axios = require("axios")

exports.cancelLeave = async (req, res) => {

    try {

        const leave = await Leave.findOne({ leaveId: req.body.leaveId })

        if(!leave){
            throw new Error (`Cannot find leave with leaveId - ${req.body.leaveId}`)
        }

        if (req.body.employeeId != leave.employeeId) {
            throw new Error("Leave cannot be cancelled by other's")
        }

        if (leave.applicationStatus != 'Applied') {
            throw new Error(`Application status is ${leave.applicationStatus}, Only Applied leave can be cancelled`)
        }

        const employee = await Employee.findOne({ employeeId: req.body.employeeId })

        if(!employee){
            throw new Error (`Cannot find employee with employee - ${req.body.employeeId}`)
        }

        let platform;
        if (req.body.isActivation === true || req.body.isActivation === 'true') {
            platform = "activation"
        }
        else {
            platform = "employeeMobile"
        }

        let url = process.env.URL + '/api/v1/hrmgmt/Leave/approveLeave';
 
        let body ={
            ...req.body,
            isApproved : false,
            isCancelled : true,
        }

        let leaveResponse = await axios.put(url, body,
            {
                headers: {
                    Authorization: req.headers.authorization,
                    platform: platform
                }
            })

        console.log(leaveResponse.data, 'leaveResponse')

        if (leaveResponse.status != 200) {
            throw new Error("Cannot cancel leave")
        }

        res.status(200).json({
            status: true,
            message: "Leave cancelled successfully",
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