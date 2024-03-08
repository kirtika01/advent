const Employee = require('../../../models/HRMgmt/Employee');
const Squad = require('../../../models/HRMgmt/Squad');

exports.getSquadBySquadCode = async (req, res) => {
    try{
        let squad = await Squad.findOne({squadCode: req.params.squadCode}).populate('relatedSquad');

        if (squad){

            let squadMembers = await Employee.find({squads:{$elemMatch:{squadCode:req.params.squadCode}}});


            squad={...squad._doc,squadMembers:squadMembers}

            return res.status(200).json({
                status:true,
                squadCode:req.params.squadCode,
                squadMemberCount:squadMembers.length,
                squad:squad
            })
        }
        throw new Error(`No squad found for squadCode - ${req.params.squadCode}`)
    }
    catch(err){
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}
