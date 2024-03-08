const Geo = require('../../../models/HRMgmt/Geo');

exports.getGeoByGeoCode = async (req, res) => {
    try{
        const geo = await Geo.findOne({geoCode: req.params.geoCode})

        if(geo){
            return res.status(200).json({
                status: true,
                message: "Geo found with geoCode - " + req.params.geoCode ,
                Geo: geo
            })
        }
        else{
            return res.status(200).json({
                status: false,
                message: "Geo not found"
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}