const Geo = require('../../../models/HRMgmt/Geo');

exports.updateGeo = async (req, res) => {
    try{
        const geo = await Geo.findOne({geoCode: req.body.geoCode})

        if(geo){
            const updateGeo = await Geo.findOneAndUpdate({geoCode: req.body.geoCode},{ $set:req.body.update}, {new: true})

            if(updateGeo){
                return res.status(200).json({
                    status: true,
                    message: "Geo updated successfully",
                    Geo: updateGeo
                })
            }
            else{
                throw new Error("Could not update Geo")
            }
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