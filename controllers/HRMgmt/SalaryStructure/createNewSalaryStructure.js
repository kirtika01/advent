const SalaryStructure = require('../../../models/HRMgmt/SalaryStructure')
const Employee = require('../../../models/HRMgmt/Employee')
const Counter = require('../../../models/Counter')
const axios = require('axios')


exports.createNewSalaryStructure = async (req, res, next) => {
    let flag = true;

    try {


        var token = req.headers.authorization.split(' ')[1]


        let ctcCheck = await SalaryStructure.findOne({ employeeId: req.body.employeeId, finYear: req.body.finYear })

        if (ctcCheck) {
            flag = false;
            throw new Error(`Salary Structure already exist for ${req.body.employeeId} for the financial year ${req.body.finYear}`)
        }

        let employeeCheck = await Employee.findOne({ employeeId: req.body.employeeId })

        if (!employeeCheck) {
            flag = false;
            throw new Error('Employee does not exists')
        }


        let counter = await Counter.findOneAndUpdate({ identifierName: "SalaryStructure" }, { $inc: { count: 1 } }, { upsert: true, new: true })
        let salaryStructure = req.body
        salaryStructure.employeeId = employeeCheck.employeeId
        salaryStructure.salaryStructureId = 'SLRY-' + counter.count

        let createSalaryStructure = new SalaryStructure(salaryStructure)
        let result = await createSalaryStructure.save()

        employeeCheck.jobLevel = salaryStructure.jobLevel
        employeeCheck.designation = salaryStructure.designation

        let doc = await employeeCheck.save()

        if (!doc) {
            flag = false
            throw new Error("Unable to add details to employee")
        }

        /*let url = process.env.URL + '/api/v1/hrmgmt/salarystructure/generateCTCDoc';

        var genCTCDoc =await  axios.post(url,{

            "salaryStructureId":result.salaryStructureId

        },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'platform':'employeeMobile'
            }
        })

        if(genCTCDoc.status!==200){

            throw new Error("Unable to generate CTC Document")

        }*/


        if (result) {
            res.status(200).json({
                status: true,
                message: `Salary Structure for ${result.employeeFullName} - ${result.salaryStructureId} has been created successfully!`
            })

        }
        else {

            throw new Error("Unable to create Salary Structure")

        }

    }
    catch (err) {
        console.log(err)
        if (flag) {
            let counter = await Counter.findOneAndUpdate({ identifierName: "SalaryStructure" }, { $inc: { count: -1 } }, { new: true })
        }
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }

}