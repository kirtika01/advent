const Squad = require('../../../models/HRMgmt/Squad');

exports.updateSquadByCode = async (req, res) => {
    try{
        let squad = await Squad.findOne({squadCode: req.body.squadCode});

        if(!squad){
            return res.status(200).json({
                status: false,
                message: "Squad not found"
            })
        }
        else{
            let updatesquad = await Squad.findOneAndUpdate({squadCode: req.body.squadCode},{$set: req.body.update},{new: true});

            if(updatesquad){
                return res.status(200).json({
                    status: true,
                    message: "Squad updated successfully",
                    Squad: updatesquad
                })
            }
            else{
                return res.status(200).json({
                    status: false,
                    message: "Squad not updated"
                })
            }
        }
    }
    catch(err){
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}