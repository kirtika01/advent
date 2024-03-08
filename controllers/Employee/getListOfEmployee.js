const Employee= require("../../models/Employee");

exports.getListOfEmployee =async(req,res) =>{
    try{
        let query = {};

        if (req.query.isActive) {
            query['isActive'] = req.query.isActive;
        }

        if (req.query.employeeRole) {
            query['employeeRole'] = req.query.employeeRole;
        }

        let list;

        if (Object.keys(query).length > 0) list = await Employee.find(query); 
        else list = await Employee.find()

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                leads: list,
                No_of_Employees: list.length
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