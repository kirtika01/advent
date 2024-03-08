const Geo = require('../../../models/HRMgmt/Geo');

exports.removeCountryFromGeo = async (req, res) => {
    try{
        const geo = await Geo.findOne({'countries.countryCode': req.body.countryCode, geoCode: req.body.geoCode})

        if(geo){
            const deletecountry =await Geo.findOneAndUpdate({geoCode: req.body.geoCode },{'$pull':{ 'countries':{'countryCode': req.body.countryCode }}},{new:true});

            if(deletecountry){
                return res.status(200).json({
                    status: true,
                    message: "Country removed from Geo successfully",
                    Geo: deletecountry
                })
            }
            else{
                throw new Error("Could not remove country from Geo")
            }
        }
        else{
            return res.status(200).json({
                status: false,
                message: "Geo not found with this country"
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