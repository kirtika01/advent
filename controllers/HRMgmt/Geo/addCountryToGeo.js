const Geo = require('../../../models/HRMgmt/Geo');
const Country= require('../../../models/HRMgmt/Country');


exports.addCountryToGeo = async (req, res) => {
    try{
        //on the logic that same country cannot exist in any two geos
        const country = await Country.findOne({countryCode: req.body.country.countryCode}) 
        if(!country){
            return res.status(200).json({
                status: false,
                message: "Country is not in your Repository"
            })

        }

        const countryExists = await Geo.findOne({'countries.countryCode': req.body.country.countryCode}) 

        if(countryExists){
            return res.status(200).json({
                status: false,
                message: "Country already exists in Geo- "+countryExists.geoCode
            })
        }


        else{
            const geo = await Geo.findOne({geoCode: req.body.geoCode})

            if(geo){
                geo.countries.push(req.body.country)

                let doc = await geo.save()

                if(doc){
                    return res.status(200).json({
                        status: true,
                        message: "Country added to Geo successfully",
                        Geo: doc
                    })
                }
                else{
                    throw new Error("Could not add country to Geo")
                }
            }
            else{
                return res.status(200).json({
                    status: false,
                    message: "Geo not found"
                })
            }
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

