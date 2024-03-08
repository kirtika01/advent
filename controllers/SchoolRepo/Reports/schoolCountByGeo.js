const School = require('../../../models/SchoolRepo/School');

exports.schoolCountByGeo = async (req, res) => {
    try {

        let schools = await School.aggregate([
            {
                $match: {
                    status: "Live"
                }
            },
            {
                $group: {
                    _id: "$geo",
                    count: { $sum: 1 }
                }
            }
        ])

        //console.log(schools)
        return res.status(200).json({
            status: true,
            data: schools
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err
        })
    }
}