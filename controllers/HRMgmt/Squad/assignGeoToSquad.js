const Squad = require('../../../models/HRMgmt/Squad');

exports.assignGeoToSquad = async (req, res) => {
    try{
        let squad = await Squad.findOne({squadCode: req.body.squadCode});

        if(!squad){
            throw new Error("Squad not found")
        }

        let geo = req.body.geo;

        let geoCheck = await Squad.findOneAndUpdate({squadCode: req.body.squadCode}, {squadGeo: geo},{new: true})

        if(!geoCheck){
            throw new Error("Cannot assign geo to squad")
        }
    
        return res.status(200).json({
            status: true,
            message: "Geo assigned to squad successfully",
            Squad: geoCheck
        })
    }
    catch(err){
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}