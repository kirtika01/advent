const Employee = require('../../../models/HRMgmt/Employee');
const User = require('../../../models/User');

exports.validateRegisterCode = async (req, res) => {

    try {

        let { userName,registerCode } = req.body;

        let employee = await Employee.findOne({userName : userName})

        if (!employee) {
                
            throw new Error(`Employee not found.`)
        }

        let user = await User.findOne({ userName: userName })
        if(!user){
            throw new Error(`User not found.`)
        }

        token = jwt.sign({ userName: user.userName,employeeId: employee.employeeId, platform: 'employeeMobile' }, process.env.JWT_KEY, { expiresIn: "8h" })
            
        if(employee.registerCode === registerCode){
            return res.status(200).json({
                status: true,
                registrationValidated: true,
                token: token,
                userName: user.userName,
                employeeId: employee.employeeId,
                employeeFirstName: employee.employeeFirstName,
                message: "Register Code is valid"
            })

        }
        else{
            throw new Error(`Invalid Register Code`)
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}
