const Employee = require("../../../models/HRMgmt/Employee");
const mongoosePaginate = require('mongoose-paginate-v2');

exports.getListOfEmployee = async (req, res) => {
    try {
        let query = {};


        if (req.query.isActive) {
            query['isActive'] = req.query.isActive;
        }

        if (req.query.lineManagerId) {
            query['lineManagerId'] = req.query.lineManagerId;
        }
        if (req.query.employeeRole) {
            query['employeeRole'] = req.query.employeeRole;
        }


        if (req.query.inEmployeeRoles) {

            let employeeRoleQuery = req.query.inEmployeeRoles.split(",")
            query.employeeRole = { $in: employeeRoleQuery }

        }

        console.log(query)

        let list;

        // let no_of_docs_each_page = req.query.pageSize;
        // let current_page_number = req.query.pageNo;

        let no_of_docs_each_page = parseInt(req.query.pageSize) || 10;
        let current_page_number = parseInt(req.query.pageNo) || 0;

        // if (!req.query.pageNo) {
        //     current_page_number = 0
        // }
        // if (!req.query.pageSize) {
        //     no_of_docs_each_page = 10
        // }


        const options = {
            page: current_page_number,
            limit: no_of_docs_each_page
        };

        if (req.query.sort == 1 || req.query.sort == "1") {
            options.sort = { userName: 1 }
        }
        else if (req.query.sort == -1 || req.query.sort == "-1") {
            options.sort = { userName: -1 }
        }

        console.log(options)
        let noOfemployees

        var data

        if (Object.keys(query).length > 0) {
            noOfemployees = await Employee.find(query).count()

            //list = await Employee.paginate(query, options)

            list = await Employee.find(query)
                .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page)
        }

        else {
            noOfemployees = await Employee.find().count()
            //list = await Employee.paginate({},options)
            list = await Employee.find()
                .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page)
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                Total_No_Of_Employees: noOfemployees,
                No_of_Employees: list.length,
                employees: list,

            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Available Employees',

            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}