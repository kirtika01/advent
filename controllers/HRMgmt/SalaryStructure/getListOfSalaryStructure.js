const SalaryStructure = require("../../../models/HRMgmt/SalaryStructure");


exports.getListOfSalaryStructure = async (req,res)=>{

    try{
        
        var query={}

        if (req.query.finYear) {
            query['finYear'] = req.query.finYear;
        }

        if(req.query.jobLevel){
            query['jobLevel']=req.query.jobLevel
        }

        if(req.query.eligibleForPF){
            query['eligibleForPF']=req.query.eligibleForPF
        }

        let list 

        if (Object.keys(query).length > 0) list = await SalaryStructure.find(query);
        else list = await SalaryStructure.find()

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                No_of_SalaryStructures: list.length,
                salarystructures: list,
            })
        } 
        else {
            return res.status(200).json({
                status: false,
                message: 'No Available SalaryStructures',
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    } 
    
}
