const School = require('../../../models/SchoolRepo/School');

exports.schoolDashboardCounts = async (req, res) => {
    try {

        //count list of schools live
        let listOfSchoolLive = await School.aggregate([
            {
                $match: {
                    status: "Live"
                }
            }
        ])

        //console.log(listOfSchoolLive.length)

        let noOfGeo = await School.aggregate([
            {
                $group: {
                    _id: "$geo",
                    count: { $sum: 1 }
                }
            }
        ])

        //console.log(noOfGeo)

        let noOfCountries = await School.aggregate([
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 }
                }
            }
        ])

        //console.log(noOfCountries)

        //school added in last 90 days

        let schoolAddedInLast90Days = await School.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000))
                    }
                }
            }

        ])

        //console.log(schoolAddedInLast90Days)

        return res.status(200).json({
            status: true,
            report: {
                listOfSchoolLive: listOfSchoolLive.length,
                noOfGeo: noOfGeo.length,
                noOfCountries: noOfCountries.length,
                schoolAddedInLast90Days: schoolAddedInLast90Days.length
            }

        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err
        })
    }
}