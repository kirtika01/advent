const LeavePlan = require("../../../models/HRMgmt/LeavePlan");

exports.updateLeavePlan = async (req, res) => {
  try {
    const result = await LeavePlan.findOneAndUpdate({ leavePlanId: req.body.leavePlanId},
      req.body.update,
      { new: true }
    );
        console.log(result);
    if(result){

      res.status(200).json({
        status: true,
        message: "Leave Plan updated successsfully",
        LeavePlan: result,
      });

    }
    else{
      throw new Error("Unable to update Leave Plan Details leavePlanId is incorrect")
    }
    
  } catch (err) {
    return res.status(500).json({
        status:false,
        error:err.toString()
    });
  }
};
