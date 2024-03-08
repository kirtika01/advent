const Geo = require('../../../models/HRMgmt/Geo');

exports.getGeoByCountryCode = async (req, res) => {
    try{
        const geo = await Geo.findOne({'countries.countryCode': req.params.countryCode})

        if(geo){
            return res.status(200).json({
                status: true,
                message: "Geo found with countryCode - " + req.params.countryCode ,
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