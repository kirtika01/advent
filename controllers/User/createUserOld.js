const User = require("../../models/User");
const Counter = require("../../models/Counter");
const Employee = require('../../models/HRMgmt/Employee')
const axios = require('axios');

exports.createUser = async (req, res) => {
    try {

        //console.log('Hiiiiii')
        var userName = await User.findOne({ userName: req.body.userName })
        if (userName) {
            return res.status(200).json({
                status: false,
                message: "User already exist",
            });
        }
        else {


            let user = req.body;

            var newUser = new User(user);

            newUser.registeredEmailId = req.body.officialEmail;
            newUser.registeredPhoneNo = req.body.officialMobile;

            //check if any employee with the same username exists
            if (req.body.isEmployee == true) {

                let employee = await Employee.find({ employeeId: newUser.employeeId });

                if (employee.length != 0) {
                    return res.status(200).json({
                        status: false,
                        message: `${employee.employeeId} already exists ! Try using different Employee Id.`
                    })
                }
            }

            if (req.body.isEmployee == true) {

                newUser.userFullName = ``;

                // let body = {
                //     ...user,
                //     isActive: user.isActive,
                //     userName: user.userName,
                //     officialEmail: user.registeredEmailId,
                //     officialMobile: user.registeredPhoneNo,

                // }
                let body = {
                    ...user,
                    isActive: user.isActive,
                    userName: user.userName,
                    officialEmail: user.officialEmail,
                    officialMobile: user.officialMobile,
                    department: user.userDepartment,
                    designation: user.userRole
                }

                if (user.personalMobile) {
                    body = {
                        ...body,
                        personalMobile: user.personalMobile
                    }
                }

                if (user.personalEmail) {
                    body = {
                        ...body,
                        personalEmail: user.personalEmail
                    }
                }

                if (user.userFirstName) {
                    body.employeeFirstName = user.userFirstName;
                    newUser.userFullName += user.userFirstName
                }
                if (user.userMiddleName) {
                    body.employeeMiddleName = user.userMiddleName
                    newUser.userFullName += ' ' + user.userMiddleName
                }
                if (user.userLastName) {
                    body.employeeLastName = user.userLastName
                    newUser.userFullName += ' ' + user.userLastName
                }

                body.employeeFullName = newUser.userFullName


                if (req.body.isEmployee === true) {

                    let url = process.env.URL + '/api/v1/hrmgmt/employee/createNewEmployee';

                    let token = req.headers.authorization;

                    try {
                        let res = await axios.post(url, body,
                            {
                                headers: {
                                    'Authorization': `${token}`,
                                    platform: "employeeWeb"
                                }
                            })

                        if (res.status === 200) {

                            //continue
                            newUser.employeeId = res.data.employee.employeeId;
                            console.log(res.data.message);
                        }
                    } catch (err) {
                        console.log(err.toString())
                        throw new Error(err.response.data.error)

                    }
                }

                let doc = await newUser.save();

                if (doc) {
                    return res.status(200).json({
                        status: true,
                        message: 'New User successfully created',
                        user: doc
                    })

                } else {

                    throw new Error(`Unable to create a new User`)

                }

            }
        }
    }
    catch (err) {
        console.log(err);
        var counter = await Counter.findOneAndUpdate({ identifierName: "User" }, { $inc: { count: -1 } }, { new: true });
        return res.status(500).json({
            status: false,
            error: err,
        });
    }
};