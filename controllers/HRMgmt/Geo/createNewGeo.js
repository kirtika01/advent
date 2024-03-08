const Geo = require('../../../models/HRMgmt/Geo');

exports.createNewGeo = async (req, res) => {
    try{
        const geo = await Geo.findOne({geoCode: req.body.geoCode})

        if(geo){
            return res.status(200).json({
                status: false,
                message: "Geo already exists"
            })
        }
        else{
            const newGeo = new Geo(req.body)

            let doc = await newGeo.save()

            if(doc){
                return res.status(200).json({
                    status: true,
                    message: "Geo created successfully",
                    data: doc
                })
            }
            else{
                throw new Error("Could not create Geo")
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