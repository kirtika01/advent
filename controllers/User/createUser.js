const User = require("../../models/User");

exports.createUser = async (req, res) => {

    try {

        let saveUser;

        let chkUserName = await User.findOne({
            $or: [
                { userName: req.body.userName },
                { registeredEmailId: req.body.registeredEmailId },
                { registeredPhoneNo: req.body.registeredPhoneNo }
            ]
        })

        console.log(chkUserName)

        if (chkUserName) {
             return res.status(200).json({
                status: false,
                message: "Please insert unique Username, Email Id or Phone no."
            })
        }

        let newUser = new User(req.body);

        saveUser = await newUser.save();

        if (!saveUser) {
            throw new Error('Unable to create new user. Contact support team')
        }

        return res.status(200).json({
            status: true,
            message: "User created successfully",
            data: saveUser
        });


    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString(),
        });
    };

}

    // function updateEmployeeBody(employee, saveUser) {
    //     let body = {
    //         userName: saveUser.userName,
    //         employeeId: employee.employeeId,
    //         employeeRole: saveUser.userRole,
    //         employeeFirstName: saveUser.userFirstName,
    //         employeeMiddleName: saveUser.userMiddleName,
    //         employeeLastName: saveUser.userLastName,
    //         employeeFullName: saveUser.userFullName,
    //         officialEmail: saveUser.registeredEmailId,
    //         officialMobile: saveUser.registeredPhoneNo,
    //         salutation: employee.salutation,
    //         gender: employee.gender,
    //         dateOfBirth: employee.dateOfBirth,
    //         placeOfBirth: employee.placeOfBirth,
    //         bloodGroup: employee.bloodGroup,
    //         phoneCode: employee.phoneCode,
    //         phoneNumber: employee.phoneNumber,
    //         presentAddress: employee.presentAddress,
    //         permanentAddress: employee.permanentAddress,
    //         fatherName: employee.fatherName,
    //         motherName: employee.motherName,
    //         maritalStatus: employee.maritalStatus,
    //         emergencyContact: employee.emergencyContact,
    //         employeeAadhar: employee.employeeAadhar,
    //         employeePAN: employee.employeePAN,
    //         employeePassport: employee.employeePassport,
    //         educationalDetails: employee.educationalDetails,
    //         previousEmployerDetails: employee.previousEmployerDetails,
    //     }
    //     return body;
    // }