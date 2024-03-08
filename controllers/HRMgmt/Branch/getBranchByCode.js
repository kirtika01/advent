const Branch= require("../../../models/HRMgmt/Branch");

exports.getBranchByCode = async (req, res) => {

    try{

        const branch = await Branch.aggregate([
            { $match: { branchCode: req.params.branchCode } },
            {
              $lookup: {
                from: 'employees', 
                localField: 'branchAdmin',
                foreignField: '_id',
                as: 'branchAdmin'
              }
            },
            {
              $lookup: {
                from: 'employees',
                localField: 'HRAssociate',
                foreignField: '_id',
                as: 'HRAssociate'
              }
            },
            {
              $lookup: {
                from: 'finteams',
                localField: 'finTeam',
                foreignField: '_id',
                as: 'finTeam'
              }
            },
            {
              $lookup: {
                from: 'employees',
                localField: 'financeAdmin',
                foreignField: '_id',
                as: 'financeAdmin'
              }
            }
          ]);
        // const branch = await Branch.findOne({ branchCode: req.params.branchCode } )
        // .populate('branchAdmin')
        // .populate('HRAssociate')
        // .populate('finTeam')
        // .populate('financeAdmin');

        if(!branch){
            return res.status(200).json({
                status:true,
                message:"Branch not found"
            })
        }
        else{
          return res.status(200).json({
            status:true,
            Branch: branch
        })        }

    }

    catch(err){

        console.log(err)
        res.status(500).json({
            status:false,
            message:err.toString()
        })

    }
}