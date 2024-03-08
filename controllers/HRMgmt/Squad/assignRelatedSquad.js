const Squad = require('../../../models/HRMgmt/Squad');

exports.assignRelatedSquad = async (req, res) => {
    try{

        let squad1 = await Squad.findOne({squadCode: req.body.squadCode1});
        let squad2 = await Squad.findOne({squadCode: req.body.squadCode2});

        if(!squad1) throw new Error("No Squad Found for squadCode-- "+req.body.squadCode1)
        if(!squad2) throw new Error("No Squad Found for squadCode-- "+req.body.squadCode2)

        let updateSquad1 = await Squad.findOneAndUpdate({squadCode:req.body.squadCode1},{$set:{relatedSquad:squad2,isRelatedSquadAssigned:true}},{new:true});
        let updateSquad2 = await Squad.findOneAndUpdate({squadCode:req.body.squadCode2},{$set:{relatedSquad:squad1,isRelatedSquadAssigned:true}},{new:true});

        if(!updateSquad1 || !updateSquad2) throw new Error("Unable to add relatedSquad")

        else{
            return res.status(200).json({
                status: true,
                message: "Related Squad Added Successfully",
                squadCode1:req.body.squadCode1,
                squadCode2:req.body.squadCode2,
                squad1:updateSquad1,
                squad2:updateSquad2
            })
        }

    }
    catch(err){
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}




/*

input two Squad Code
check for both two squad code in squad collection

if both present


assign relatedSquad in each other 

relatedSquad: {
        type: Schema.Types.ObjectId,
        ref: 'Squad'
    }
    


*/