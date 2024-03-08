const SalaryStructure = require("../../../models/HRMgmt/SalaryStructure");


exports.deleteSalaryStructureById = async (req,res)=>{

    try{
        let doc = await SalaryStructure.findOneAndDelete({salaryStructureId: req.params.salaryStructureId})

        if(!doc){
            throw new error(`Cannot delete salaryStructure with salaryStructureId - ${req.params.salaryStructureId}`)
        }
        
        return res.status(200).json({
            status:true,
            message:`salaryStructure with salaryStructureId - ${req.params.salaryStructureId} deleted successfully`
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            error:err.toString()
        })
    } 
}
