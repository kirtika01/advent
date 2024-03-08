const School = require("../../../models/SchoolRepo/School");


exports.getListOfSchool = async (req, res) => {

    try {
        let query = {};

        if (req.query.geo) {
            query['geo'] = req.query.geo;
        }

        if (req.query.country) {

            query['country'] = req.query.country
        }

        if (req.query.schoolType) {
            query['schoolType'] = req.query.schoolType;
        }

        if (req.query.isFocused) {
            query['isFocused'] = req.query.isFocused;
        }

        if (req.query.schoolCategory) {
            query['schoolCategory'] = req.query.schoolCategory;
        }

        if (req.query.scholarshipAvailable) {
            query['scholarshipAvailable'] = req.query.scholarshipAvailable;
        }

        if (req.query.status) {
            query['status'] = req.query.status;
        }

        


        if (req.query.city) {

            query['city'] = req.query.city
        }
        
        
        
        if (req.query.isLive === true) {
            query['status'] = 'Live'
        } else if(req.query.isLive === false) {
            query['status'] = { $in: ['Live', 'In Review' , 'Decommisioned'] }
        }

        if (req.query.createdIn) {
            query["createdAt"] = {
                $gte: new Date(new Date().getTime() - (req.query.createdIn * 24 * 60 * 60 * 1000))
            }
        }

        //console.log(query)

        let list;

        if (Object.keys(query).length > 0) {

            list = await School.find(query);
        } else {
            list = await School.find()
        }

        if (list.length > 0) {
            return res.status(200).json({
                status: true,
                No_of_Schools: list.length,
                schools: list
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'No School Found',
            })
        }

    }

    catch (err) {
        console.log(err)

        return res.status(500).json({
            status: false,
            message: err.toString()

        })


    }




}