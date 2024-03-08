const Geo = require('../../../models/HRMgmt/Geo');

exports.getListOfGeo = async (req, res) => {
    try{
        let query= {};


        let list;

        if (Object.keys(query).length > 0) {

            list = await Geo.find(query);
        } else {
            list = await Geo.find()
        }

        if(list.length>0){
            return res.status(200).json({
                status: true,
                No_of_Geo : list.length,
                List_of_Geo: list
                
            })
        }
        else{
            return res.status(200).json({
                status:false,
                message: "No Geo Found"
            })
        }
    }
    catch(err){
        return res.status(500).json({
            status: false,
            error: err.toString()
        })

    }
}