const Branch= require("../../../models/HRMgmt/Branch");
const Counter = require('../../../models/Counter');


exports.createBranch = async (req, res) => {
try{

    var counter = await Counter.findOneAndUpdate({ identifierName: "Branch" }, { $inc: { count: 1 } }, { upsert: true, new: true })

    var branch=(req.body)
    branch.branchCode="BRNCH-"+  counter.count

    var newBranch = new Branch(branch)
    await newBranch.save()

    if(newBranch){

        return res.status(200).json({
            status:true,
            message:`New Branch -  ${newBranch.branchCode} created successfully`,
            branch:newBranch
        })

    }
    else{
        return res.status(200).json({
            status:false,
            message:`Branch Creation Un-Successful`
        })

    }

}
catch (err) {
    console.log(err)
    var counter = await Counter.findOneAndUpdate({ identifierName: "Branch" }, { $inc: { count: -1 } }, { upsert: true, new: true })

    
    return res.status(500).json({
        status: false,
        error: err.toString()
    })
}
}