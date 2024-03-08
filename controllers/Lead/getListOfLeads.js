const Lead =require("../../models/Lead");

exports.getListOfLeads = async(req,res) =>{
    try{

        let query = {};

        if (req.query.assigneeUserFullName) {
            query['assigneeUserFullName'] = req.query.assigneeUserFullName;
        }

        let list;

        if (Object.keys(query).length > 0) {

            list = await Lead.find(query);
        } else {
            list = await Lead.find()
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                leads: list,
                No_of_Leads: list.length
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No Available Leads',
               
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }
}